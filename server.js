/**
 * ============================================================================
 * AL-IBRIEZ BOOK - SERVER & NEON POSTGRESQL REST API
 * Official Store: Al-Qur'an Al-Muttaqin (Penerbit Al-Qosbah)
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Helper: Query wrapper with auto-release
async function dbQuery(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return { ...res, duration };
}

// ============================================================================
// API ROUTES
// ============================================================================

// 1. Health & Connection Status
app.get('/api/health', async (req, res) => {
  try {
    const startTime = Date.now();
    const dbRes = await pool.query('SELECT current_database(), current_user, version();');
    const latencyMs = Date.now() - startTime;

    const [prodCnt, bannerCnt, testiCnt] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM catalog_products'),
      pool.query('SELECT COUNT(*) FROM hero_banners'),
      pool.query('SELECT COUNT(*) FROM testimonials')
    ]);

    res.json({
      success: true,
      status: 'connected',
      provider: 'Neon Serverless PostgreSQL',
      database: dbRes.rows[0].current_database,
      user: dbRes.rows[0].current_user,
      latencyMs,
      counts: {
        products: parseInt(prodCnt.rows[0].count),
        banners: parseInt(bannerCnt.rows[0].count),
        testimonials: parseInt(testiCnt.rows[0].count)
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: err.message
    });
  }
});

// 2. PRODUCTS API
app.get('/api/products', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM catalog_products';
    if (all !== 'true') {
      query += ' WHERE is_active = TRUE';
    }
    query += ' ORDER BY sort_order ASC, created_at ASC';

    const result = await dbQuery(query);
    const products = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      price: parseFloat(r.price),
      oldPrice: r.old_price ? parseFloat(r.old_price) : null,
      image: r.image,
      desc: r.description,
      badge: r.badge || '',
      category: r.category || 'Tilawah',
      weight: parseFloat(r.weight) || 0.65,
      isActive: r.is_active,
      sortOrder: r.sort_order
    }));

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    if (!p.id || !p.name || p.price === undefined) {
      return res.status(400).json({ success: false, message: 'ID, Nama, dan Harga wajib diisi' });
    }

    const query = `
      INSERT INTO catalog_products (id, name, price, old_price, image, description, badge, category, weight, is_active, sort_order, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        old_price = EXCLUDED.old_price,
        image = EXCLUDED.image,
        description = EXCLUDED.description,
        badge = EXCLUDED.badge,
        category = EXCLUDED.category,
        weight = EXCLUDED.weight,
        is_active = EXCLUDED.is_active,
        sort_order = EXCLUDED.sort_order,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      p.id,
      p.name,
      p.price,
      p.oldPrice || null,
      p.image || 'assets/prod-nonterjemah.svg',
      p.desc || '',
      p.badge || '',
      p.category || 'Tilawah',
      p.weight || 0.65,
      p.isActive !== undefined ? p.isActive : true,
      p.sortOrder || 0
    ];

    const result = await dbQuery(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products/bulk', async (req, res) => {
  const client = await pool.connect();
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ success: false, message: 'Invalid products array' });
    }

    await client.query('BEGIN');
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      await client.query(`
        INSERT INTO catalog_products (id, name, price, old_price, image, description, badge, category, weight, is_active, sort_order, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          old_price = EXCLUDED.old_price,
          image = EXCLUDED.image,
          description = EXCLUDED.description,
          badge = EXCLUDED.badge,
          category = EXCLUDED.category,
          weight = EXCLUDED.weight,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order,
          updated_at = CURRENT_TIMESTAMP
      `, [
        p.id,
        p.name,
        p.price,
        p.oldPrice || null,
        p.image || 'assets/prod-nonterjemah.svg',
        p.desc || '',
        p.badge || '',
        p.category || 'Tilawah',
        p.weight || 0.65,
        p.isActive !== undefined ? p.isActive : true,
        p.sortOrder !== undefined ? p.sortOrder : i + 1
      ]);
    }
    await client.query('COMMIT');
    res.json({ success: true, message: `Synced ${products.length} products to Neon DB` });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbQuery('DELETE FROM catalog_products WHERE id = $1', [id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. HERO BANNERS API
app.get('/api/banners', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM hero_banners';
    if (all !== 'true') {
      query += ' WHERE is_active = TRUE';
    }
    query += ' ORDER BY sort_order ASC, created_at ASC';

    const result = await dbQuery(query);
    const banners = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      tag: r.tag,
      bgGradient: r.bg_gradient,
      image: r.image,
      ctaText: r.cta_text,
      ctaLink: r.cta_link,
      secondaryCtaText: r.secondary_cta_text,
      secondaryCtaLink: r.secondary_cta_link,
      openNewTab: r.open_new_tab,
      isActive: r.is_active,
      sortOrder: r.sort_order
    }));

    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const b = req.body;
    if (!b.id || !b.title) {
      return res.status(400).json({ success: false, message: 'ID dan Judul Banner wajib diisi' });
    }

    const query = `
      INSERT INTO hero_banners (id, title, subtitle, tag, bg_gradient, image, cta_text, cta_link, secondary_cta_text, secondary_cta_link, open_new_tab, is_active, sort_order, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        tag = EXCLUDED.tag,
        bg_gradient = EXCLUDED.bg_gradient,
        image = EXCLUDED.image,
        cta_text = EXCLUDED.cta_text,
        cta_link = EXCLUDED.cta_link,
        secondary_cta_text = EXCLUDED.secondary_cta_text,
        secondary_cta_link = EXCLUDED.secondary_cta_link,
        open_new_tab = EXCLUDED.open_new_tab,
        is_active = EXCLUDED.is_active,
        sort_order = EXCLUDED.sort_order,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      b.id,
      b.title,
      b.subtitle || '',
      b.tag || '',
      b.bgGradient || 'emerald',
      b.image || 'assets/banner-mushaf-utama.svg',
      b.ctaText || '',
      b.ctaLink || '',
      b.secondaryCtaText || '',
      b.secondaryCtaLink || '',
      b.openNewTab || false,
      b.isActive !== undefined ? b.isActive : true,
      b.sortOrder || 0
    ];

    const result = await dbQuery(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/banners/bulk', async (req, res) => {
  const client = await pool.connect();
  try {
    const { banners } = req.body;
    if (!Array.isArray(banners)) {
      return res.status(400).json({ success: false, message: 'Invalid banners array' });
    }

    await client.query('BEGIN');
    for (let i = 0; i < banners.length; i++) {
      const b = banners[i];
      await client.query(`
        INSERT INTO hero_banners (id, title, subtitle, tag, bg_gradient, image, cta_text, cta_link, secondary_cta_text, secondary_cta_link, open_new_tab, is_active, sort_order, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          tag = EXCLUDED.tag,
          bg_gradient = EXCLUDED.bg_gradient,
          image = EXCLUDED.image,
          cta_text = EXCLUDED.cta_text,
          cta_link = EXCLUDED.cta_link,
          secondary_cta_text = EXCLUDED.secondary_cta_text,
          secondary_cta_link = EXCLUDED.secondary_cta_link,
          open_new_tab = EXCLUDED.open_new_tab,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order,
          updated_at = CURRENT_TIMESTAMP
      `, [
        b.id,
        b.title,
        b.subtitle || '',
        b.tag || '',
        b.bgGradient || 'emerald',
        b.image || 'assets/banner-mushaf-utama.svg',
        b.ctaText || '',
        b.ctaLink || '',
        b.secondaryCtaText || '',
        b.secondaryCtaLink || '',
        b.openNewTab || false,
        b.isActive !== undefined ? b.isActive : true,
        b.sortOrder !== undefined ? b.sortOrder : i + 1
      ]);
    }
    await client.query('COMMIT');
    res.json({ success: true, message: `Synced ${banners.length} banners to Neon DB` });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbQuery('DELETE FROM hero_banners WHERE id = $1', [id]);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. TESTIMONIALS API
app.get('/api/testimonials', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM testimonials';
    if (all !== 'true') {
      query += ' WHERE is_active = TRUE';
    }
    query += ' ORDER BY sort_order ASC, created_at ASC';

    const result = await dbQuery(query);
    const testimonials = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      role: r.role,
      productName: r.product_name,
      rating: r.rating,
      text: r.text,
      isActive: r.is_active,
      sortOrder: r.sort_order
    }));

    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const t = req.body;
    if (!t.id || !t.name || !t.text) {
      return res.status(400).json({ success: false, message: 'ID, Nama, dan Isi testimoni wajib diisi' });
    }

    const query = `
      INSERT INTO testimonials (id, name, role, product_name, rating, text, is_active, sort_order, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        product_name = EXCLUDED.product_name,
        rating = EXCLUDED.rating,
        text = EXCLUDED.text,
        is_active = EXCLUDED.is_active,
        sort_order = EXCLUDED.sort_order,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      t.id,
      t.name,
      t.role || '',
      t.productName || '',
      t.rating || 5,
      t.text,
      t.isActive !== undefined ? t.isActive : true,
      t.sortOrder || 0
    ];

    const result = await dbQuery(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/testimonials/bulk', async (req, res) => {
  const client = await pool.connect();
  try {
    const { testimonials } = req.body;
    if (!Array.isArray(testimonials)) {
      return res.status(400).json({ success: false, message: 'Invalid testimonials array' });
    }

    await client.query('BEGIN');
    for (let i = 0; i < testimonials.length; i++) {
      const t = testimonials[i];
      await client.query(`
        INSERT INTO testimonials (id, name, role, product_name, rating, text, is_active, sort_order, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          product_name = EXCLUDED.product_name,
          rating = EXCLUDED.rating,
          text = EXCLUDED.text,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order,
          updated_at = CURRENT_TIMESTAMP
      `, [
        t.id,
        t.name,
        t.role || '',
        t.productName || '',
        t.rating || 5,
        t.text,
        t.isActive !== undefined ? t.isActive : true,
        t.sortOrder !== undefined ? t.sortOrder : i + 1
      ]);
    }
    await client.query('COMMIT');
    res.json({ success: true, message: `Synced ${testimonials.length} testimonials to Neon DB` });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbQuery('DELETE FROM testimonials WHERE id = $1', [id]);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. ADMIN PIN SETTINGS API
app.get('/api/settings/pin', async (req, res) => {
  try {
    const result = await dbQuery(`SELECT value FROM store_settings WHERE key = 'admin_pin'`);
    const pin = result.rows.length > 0 ? result.rows[0].value : '192837';
    res.json({ success: true, pin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/settings/pin', async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || String(pin).length !== 6) {
      return res.status(400).json({ success: false, message: 'PIN harus 6 digit angka' });
    }

    await dbQuery(`
      INSERT INTO store_settings (key, value, updated_at) 
      VALUES ('admin_pin', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `, [String(pin)]);

    res.json({ success: true, message: 'PIN Admin berhasil disimpan ke Neon DB' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. ORDERS API
// GET /api/orders — Riwayat semua pesanan (admin), filter by status or customer_wa
app.get('/api/orders', async (req, res) => {
  try {
    const { status, wa, limit = 100, offset = 0 } = req.query;
    let conditions = [];
    const values = [];
    let idx = 1;

    if (status) {
      conditions.push(`order_status = $${idx++}`);
      values.push(status);
    }
    if (wa) {
      conditions.push(`customer_wa = $${idx++}`);
      values.push(wa);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT * FROM orders
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(parseInt(limit), parseInt(offset));

    const result = await dbQuery(query, values);

    // Count total for pagination
    const countQuery = `SELECT COUNT(*) FROM orders ${whereClause}`;
    const countResult = await dbQuery(countQuery, values.slice(0, -2));

    const orders = result.rows.map(r => ({
      id: r.id,
      orderCode: r.order_code,
      customerName: r.customer_name,
      customerWa: r.customer_wa,
      destScope: r.dest_scope,
      addressSummary: r.address_summary,
      province: r.province,
      regency: r.regency,
      district: r.district,
      village: r.village,
      postalCode: r.postal_code,
      streetAddress: r.street_address,
      countryCode: r.country_code,
      countryName: r.country_name,
      productId: r.product_id,
      productName: r.product_name,
      coverColor: r.cover_color,
      quantity: r.quantity,
      weightKg: parseFloat(r.weight_kg),
      unitPriceIdr: parseFloat(r.unit_price_idr),
      subtotalIdr: parseFloat(r.subtotal_idr),
      shippingCostIdr: parseFloat(r.shipping_cost_idr),
      packagingFeeIdr: parseFloat(r.packaging_fee_idr),
      grandTotalIdr: parseFloat(r.grand_total_idr),
      courierCode: r.courier_code,
      courierLabel: r.courier_label,
      zoneName: r.zone_name,
      orderStatus: r.order_status,
      paymentStatus: r.payment_status,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    res.json({
      success: true,
      data: orders,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders — Simpan pesanan baru dari checkout pelanggan
app.post('/api/orders', async (req, res) => {
  try {
    const o = req.body;

    // Validasi field wajib
    if (!o.orderCode || !o.customerName || !o.customerWa || !o.productName) {
      return res.status(400).json({
        success: false,
        message: 'orderCode, customerName, customerWa, dan productName wajib diisi'
      });
    }

    const query = `
      INSERT INTO orders (
        order_code, customer_name, customer_wa,
        dest_scope, address_summary,
        province, regency, district, village, postal_code, street_address,
        country_code, country_name,
        product_id, product_name, cover_color,
        quantity, weight_kg, unit_price_idr, subtotal_idr,
        shipping_cost_idr, packaging_fee_idr, grand_total_idr,
        courier_code, courier_label, zone_name,
        order_status, payment_status, notes
      ) VALUES (
        $1, $2, $3,
        $4, $5,
        $6, $7, $8, $9, $10, $11,
        $12, $13,
        $14, $15, $16,
        $17, $18, $19, $20,
        $21, $22, $23,
        $24, $25, $26,
        $27, $28, $29
      )
      ON CONFLICT (order_code) DO UPDATE SET
        order_status = EXCLUDED.order_status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      o.orderCode,
      o.customerName,
      o.customerWa,
      o.destScope || 'domestic',
      o.addressSummary || '',
      o.province || null,
      o.regency || null,
      o.district || null,
      o.village || null,
      o.postalCode || null,
      o.streetAddress || null,
      o.countryCode || null,
      o.countryName || null,
      o.productId || null,
      o.productName,
      o.coverColor || null,
      o.quantity || 1,
      o.weightKg || 0,
      o.unitPriceIdr || 0,
      o.subtotalIdr || 0,
      o.shippingCostIdr || 0,
      o.packagingFeeIdr || 0,
      o.grandTotalIdr || 0,
      o.courierCode || null,
      o.courierLabel || null,
      o.zoneName || null,
      o.orderStatus || 'pending',
      o.paymentStatus || 'unpaid',
      o.notes || null
    ];

    const result = await dbQuery(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/orders/:code/status — Update status pesanan
const VALID_ORDER_STATUSES = ['pending', 'lunas', 'dikirim', 'selesai', 'batal'];

app.patch('/api/orders/:code/status', async (req, res) => {
  try {
    const { code } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!orderStatus && !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Sertakan orderStatus dan/atau paymentStatus dalam body request'
      });
    }

    if (orderStatus && !VALID_ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `orderStatus tidak valid. Gunakan salah satu: ${VALID_ORDER_STATUSES.join(', ')}`
      });
    }

    const updates = [];
    const values = [];
    let idx = 1;

    if (orderStatus) {
      updates.push(`order_status = $${idx++}`);
      values.push(orderStatus);
    }
    if (paymentStatus) {
      updates.push(`payment_status = $${idx++}`);
      values.push(paymentStatus);
    }
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(code);
    const query = `
      UPDATE orders
      SET ${updates.join(', ')}
      WHERE order_code = $${idx}
      RETURNING *;
    `;

    const result = await dbQuery(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Pesanan dengan kode "${code}" tidak ditemukan`
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for SPA if not found
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Al-Ibriez Book Server running on http://localhost:${PORT}`);
  console.log(` Neon PostgreSQL Database Connected: neondb`);
  console.log(` Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(` API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
