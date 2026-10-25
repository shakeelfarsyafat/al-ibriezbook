require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('⚡ Initializing Neon PostgreSQL Database Tables...');

    await client.query('BEGIN');

    // 1. EXTENSIONS
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 2. SETTINGS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        description VARCHAR(255),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. CATALOG PRODUCTS TABLE (for website frontend & admin)
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog_products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        old_price NUMERIC(12, 2),
        image TEXT,
        description TEXT,
        badge VARCHAR(50),
        category VARCHAR(100) DEFAULT 'Tilawah',
        weight NUMERIC(6, 2) DEFAULT 0.65,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. HERO BANNERS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_banners (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        tag VARCHAR(100),
        bg_gradient VARCHAR(50) DEFAULT 'emerald',
        image TEXT,
        cta_text VARCHAR(100),
        cta_link VARCHAR(255),
        secondary_cta_text VARCHAR(100),
        secondary_cta_link VARCHAR(255),
        open_new_tab BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. TESTIMONIALS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        role VARCHAR(200),
        product_name VARCHAR(200),
        rating INT DEFAULT 5,
        text TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. ORDERS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_code VARCHAR(64) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_wa VARCHAR(50) NOT NULL,
        dest_scope VARCHAR(20) DEFAULT 'domestic',
        address_summary TEXT NOT NULL,
        province VARCHAR(100),
        regency VARCHAR(100),
        district VARCHAR(100),
        village VARCHAR(100),
        postal_code VARCHAR(20),
        street_address TEXT,
        country_code VARCHAR(10),
        country_name VARCHAR(100),
        product_id VARCHAR(64),
        product_name VARCHAR(255) NOT NULL,
        cover_color VARCHAR(50),
        quantity INT DEFAULT 1,
        weight_kg NUMERIC(6, 2) NOT NULL,
        unit_price_idr NUMERIC(12, 2) NOT NULL,
        subtotal_idr NUMERIC(12, 2) NOT NULL,
        shipping_cost_idr NUMERIC(12, 2) NOT NULL,
        packaging_fee_idr NUMERIC(12, 2) DEFAULT 0,
        grand_total_idr NUMERIC(12, 2) NOT NULL,
        courier_code VARCHAR(50),
        courier_label VARCHAR(100),
        zone_name VARCHAR(150),
        order_status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'unpaid',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. INDEXES
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_wa ON orders(customer_wa);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);`);

    // SEED INITIAL DATA IF TABLES EMPTY
    // A. Check and Seed Settings
    const pinRes = await client.query(`SELECT value FROM store_settings WHERE key = 'admin_pin'`);
    if (pinRes.rows.length === 0) {
      await client.query(`
        INSERT INTO store_settings (key, value, description) 
        VALUES ('admin_pin', '192837', 'PIN Akses Admin Dashboard Toko Al-Ibriez Book')
      `);
      console.log('✓ Seeded default admin_pin: 192837');
    }

    // B. Check and Seed Catalog Products
    const prodCountRes = await client.query(`SELECT COUNT(*) FROM catalog_products`);
    if (parseInt(prodCountRes.rows[0].count) === 0) {
      const defaultProducts = [
        {
          id: 'QOS-HAFALAN',
          name: "Al-Qur'an Untuk Hafalan",
          price: 75000,
          old_price: 95000,
          image: 'assets/prod-hafalan.svg',
          description: 'Dilengkapi 5 blok warna hafalan per-halaman, panduan pengingat awal ayat, & motivasi tahfidz.',
          badge: 'BEST SELLER',
          category: 'Hafalan',
          weight: 0.70,
          sort_order: 1
        },
        {
          id: 'QOS-TERJEMAH',
          name: "Al-Qur'an Dengan Terjemah",
          price: 88000,
          old_price: 110000,
          image: 'assets/prod-terjemah.svg',
          description: 'Terjemahan lengkap Kementerian Agama RI, asbabun nuzul, serta indeks tematik ayat Al-Qur\'an.',
          badge: '',
          category: 'Terjemah',
          weight: 0.85,
          sort_order: 2
        },
        {
          id: 'QOS-MTQ-A5',
          name: "Al-Qur'an Non Terjemah (Al-Muttaqin A5)",
          price: 65000,
          old_price: 78000,
          image: 'assets/prod-nonterjemah.svg',
          description: 'Mushaf Al-Muttaqin: Tajwid Multikode warna, panduan Waqaf & Ibtida\' nafas pendek.',
          badge: 'TILAWAH UTAMA',
          category: 'Tilawah',
          weight: 0.65,
          sort_order: 3
        },
        {
          id: 'QOS-MTQ-A4',
          name: "Al-Qur'an Non Terjemah (Al-Muttaqin A4 Jumbo)",
          price: 99000,
          old_price: 125000,
          image: 'assets/prod-nonterjemah.svg',
          description: 'Mushaf Al-Muttaqin ukuran besar, huruf ekstra besar ramah lansia.',
          badge: '',
          category: 'Tilawah',
          weight: 1.15,
          sort_order: 4
        },
        {
          id: 'QOS-TAFSIR',
          name: "Al-Qur'an Dengan Tafsir Tematik",
          price: 115000,
          old_price: 145000,
          image: 'assets/prod-tafsir.svg',
          description: 'Kompilasi tafsir mu\'tabar berdasar tema aqidah, syariah, akhlak, dan sejarah Nabi.',
          badge: '',
          category: 'Tafsir',
          weight: 1.20,
          sort_order: 5
        },
        {
          id: 'QOS-JAKET',
          name: "Al-Qur'an Dengan Cover Jaket",
          price: 95000,
          old_price: 120000,
          image: 'assets/prod-jaket.svg',
          description: 'Sampul resleting kulit sintetis lux yang tahan percikan air, pengait tas & tali pembatas.',
          badge: '',
          category: 'Cover Kulit',
          weight: 0.75,
          sort_order: 6
        },
        {
          id: 'QOS-BUKU',
          name: "Buku Bacaan & Panduan Tajwid",
          price: 45000,
          old_price: 60000,
          image: 'assets/prod-buku.svg',
          description: 'Buku bimbingan tajwid praktis, makhorijul huruf bergambar, risalah doa harian & zikir.',
          badge: '',
          category: 'Buku',
          weight: 0.35,
          sort_order: 7
        }
      ];

      for (const p of defaultProducts) {
        await client.query(`
          INSERT INTO catalog_products (id, name, price, old_price, image, description, badge, category, weight, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [p.id, p.name, p.price, p.old_price, p.image, p.description, p.badge, p.category, p.weight, p.sort_order]);
      }
      console.log(`✓ Seeded ${defaultProducts.length} default catalog products to Neon DB`);
    }

    // C. Check and Seed Hero Banners
    const bannerCountRes = await client.query(`SELECT COUNT(*) FROM hero_banners`);
    if (parseInt(bannerCountRes.rows[0].count) === 0) {
      const defaultBanners = [
        {
          id: 'BANNER-1',
          title: "Al-Qur'an Al-Muttaqin Tajwid Multikode & Waqaf Ibtida'",
          subtitle: "Dilengkapi panduan tajwid kode warna standar Kemenag RI & jeda nafas waqaf ibtida' praktis. Sangat nyaman dibaca oleh pemula, santri, hingga orang tua.",
          tag: "MUSHAF TILAWAH UTAMA",
          bg_gradient: "emerald",
          image: "assets/banner-mushaf-utama.svg",
          cta_text: "Lihat Contoh Tajwid & Waqaf",
          cta_link: "#sectionContohBacaan",
          secondary_cta_text: "Pesan Sekarang",
          secondary_cta_link: "#sectionProduk",
          open_new_tab: false,
          sort_order: 1
        },
        {
          id: 'BANNER-2',
          title: "Mushaf Hafalan Al-Muttaqin 5 Blok Warna",
          subtitle: "Metode teruji 5 jam hafal 1 halaman. Dilengkapi pengingat kata kunci awal ayat, tema ayat, dan panduan motivasi tahfidz.",
          tag: "BEST SELLER TAHFIDZ",
          bg_gradient: "navy",
          image: "assets/banner-hafalan.svg",
          cta_text: "Beli Mushaf Hafalan",
          cta_link: "#sectionProduk",
          secondary_cta_text: "Lihat Spesifikasi",
          secondary_cta_link: "#sectionKeunggulan",
          open_new_tab: false,
          sort_order: 2
        },
        {
          id: 'BANNER-3',
          title: "Promo Spesial Toko Resmi: Diskon s/d 30%",
          subtitle: "Garansi 100% Produk Original Al-Qosbah. Siap kirim aman dengan bubble wrap ke seluruh wilayah Indonesia & pemesanan mancanegara.",
          tag: "PROMO HARI INI",
          bg_gradient: "ruby",
          image: "assets/banner-promo.svg",
          cta_text: "Ambil Promo Diskon",
          cta_link: "#sectionProduk",
          secondary_cta_text: "Tanya Admin WhatsApp",
          secondary_cta_link: "https://wa.me/6281234567890?text=Halo%20Admin%20Al-Ibriez%20Book,%20saya%20ingin%20tanya%20promo%20mushaf%20Al-Qur'an",
          open_new_tab: true,
          sort_order: 3
        },
        {
          id: 'BANNER-4',
          title: "Inspiring People to Love & Live with Quran",
          subtitle: "Menemani langkah setiap insan dan keluarga muslim untuk senantiasa dekat, membaca, dan mentadaburi Kalam Ilahi setiap hari.",
          tag: "OFFICIAL STORE AL-IBRIEZ",
          bg_gradient: "amber",
          image: "assets/hero-kids-quran.svg",
          cta_text: "Jelajahi Semua Koleksi",
          cta_link: "#sectionProduk",
          secondary_cta_text: "Tentang Kami",
          secondary_cta_link: "#sectionKeunggulan",
          open_new_tab: false,
          sort_order: 4
        }
      ];

      for (const b of defaultBanners) {
        await client.query(`
          INSERT INTO hero_banners (id, title, subtitle, tag, bg_gradient, image, cta_text, cta_link, secondary_cta_text, secondary_cta_link, open_new_tab, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [b.id, b.title, b.subtitle, b.tag, b.bg_gradient, b.image, b.cta_text, b.cta_link, b.secondary_cta_text, b.secondary_cta_link, b.open_new_tab, b.sort_order]);
      }
      console.log(`✓ Seeded ${defaultBanners.length} default hero banners to Neon DB`);
    }

    // D. Check and Seed Testimonials
    const testiCountRes = await client.query(`SELECT COUNT(*) FROM testimonials`);
    if (parseInt(testiCountRes.rows[0].count) === 0) {
      const defaultTestimonials = [
        {
          id: 'TESTI-1',
          name: 'Ustadz Ahmad Fauzi, S.Pd.I',
          role: 'Pengasuh Rumah Tahfidz, Bandung',
          product_name: "Al-Qur'an Al-Muttaqin A5 Tajwid Warna",
          rating: 5,
          text: "Alhamdulillah panduan waqaf & ibtida' di mushaf Al-Muttaqin sangat membantu santri-santri kami yang nafasnya pendek. Kertas QPP halus, tajwid warnanya sangat jelas dan tidak bikin mata lelah.",
          sort_order: 1
        },
        {
          id: 'TESTI-2',
          name: 'Ibu Hj. Siti Nurhaliza',
          role: 'Jamaah Pengajian Ibu-Ibu, Tangerang Selatan',
          product_name: "Al-Qur'an Al-Muttaqin A4 Jumbo Lansia",
          rating: 5,
          text: "Ukuran A4 jumbo ini luar biasa hurufnya besar dan jelas sekali. Mata saya yang sudah plus sekarang bisa mengaji tanpa kacamata tebal. Pengiriman sangat aman dibungkus bubble wrap tebal.",
          sort_order: 2
        },
        {
          id: 'TESTI-3',
          name: 'dr. H. Rahmat Hidayat, Sp.PD',
          role: 'Dokter Umum & Sahabat Quran, Surabaya',
          product_name: "Al-Qur'an Cover Kulit Resleting (Jaket Lux)",
          rating: 5,
          text: "Cover jaket kulitnya lux dan resletingnya kokoh, mudah dibawa dinas ke rumah sakit tanpa takut lembaran kertasnya rusak atau kotor. Kualitas kertas QPP premium lembut di mata.",
          sort_order: 3
        }
      ];

      for (const t of defaultTestimonials) {
        await client.query(`
          INSERT INTO testimonials (id, name, role, product_name, rating, text, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [t.id, t.name, t.role, t.product_name, t.rating, t.text, t.sort_order]);
      }
      console.log(`✓ Seeded ${defaultTestimonials.length} default testimonials to Neon DB`);
    }

    await client.query('COMMIT');
    console.log(' All tables initialized and verified on Neon PostgreSQL successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed initializing Neon DB:', err);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  initDatabase().then(() => {
    pool.end();
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { initDatabase, pool };
