-- =====================================================================
-- TOKO AL-IBRIEZ BOOK - E-COMMERCE DATABASE SCHEMA
-- Produk Utama: Al-Qur'an Al-Muttaqin Cetakan Penerbit Al-Qosbah
-- (Tajwid Multikode Full Color & Panduan Waqaf Ibtida')
-- PostgreSQL 14+ / MySQL 8.0 Compatible
-- =====================================================================

-- 1. EXTENSIONS (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM ENUMS
CREATE TYPE order_status_enum AS ENUM (
    'pending_payment',
    'payment_verified',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);

CREATE TYPE payment_method_enum AS ENUM (
    'bca_transfer',
    'bsi_transfer',
    'mandiri_transfer',
    'wise_wire',
    'remitly_wire'
);

CREATE TYPE courier_service_enum AS ENUM (
    'pos_indonesia',
    'jnt_express',
    'sicepat',
    'jne_cargo',
    'pos_ems_international',
    'dhl_express',
    'fedex_priority'
);

-- 3. PRODUCTS & VARIANTS
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title_id VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_id TEXT,
    description_en TEXT,
    publisher VARCHAR(150) DEFAULT 'Penerbit Al-Qosbah',
    store_name VARCHAR(150) DEFAULT 'Toko Al-Ibriez Book',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    name_id VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    size_category VARCHAR(50) NOT NULL, -- 'A5', 'A4', 'BUNDLE'
    weight_kg NUMERIC(5, 2) NOT NULL,
    length_cm NUMERIC(5, 2) NOT NULL,
    width_cm NUMERIC(5, 2) NOT NULL,
    height_cm NUMERIC(5, 2) NOT NULL,
    price_idr NUMERIC(12, 2) NOT NULL,
    price_usd_approx NUMERIC(8, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SHIPPING ZONES & RATES
CREATE TABLE shipping_zones (
    id SERIAL PRIMARY KEY,
    zone_code VARCHAR(32) UNIQUE NOT NULL,
    zone_name VARCHAR(100) NOT NULL
);

CREATE TABLE shipping_countries (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dial_code VARCHAR(10) NOT NULL,
    zone_id INT REFERENCES shipping_zones(id),
    currency_code CHAR(3) NOT NULL,
    exchange_rate_to_usd NUMERIC(12, 6) NOT NULL
);

CREATE TABLE shipping_rate_matrices (
    id SERIAL PRIMARY KEY,
    zone_id INT REFERENCES shipping_zones(id) ON DELETE CASCADE,
    courier_code courier_service_enum NOT NULL,
    courier_label VARCHAR(100) NOT NULL,
    base_weight_kg NUMERIC(4, 2) DEFAULT 1.0,
    base_rate_idr NUMERIC(12, 2) NOT NULL,
    incremental_per_kg_idr NUMERIC(12, 2) NOT NULL,
    estimated_delivery_days VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. CUSTOMERS
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    whatsapp_number VARCHAR(50) NOT NULL,
    country_code CHAR(2) REFERENCES shipping_countries(code),
    state_province VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    complete_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(32) UNIQUE NOT NULL, -- e.g., 'ALB-2026-9041'
    customer_id UUID REFERENCES customers(id),
    variant_id INT REFERENCES product_variants(id),
    cover_color VARCHAR(30) DEFAULT 'Hijau Zamrud',
    quantity INT DEFAULT 1,
    total_weight_kg NUMERIC(6, 2) NOT NULL,
    
    -- Monetary calculation
    subtotal_idr NUMERIC(12, 2) NOT NULL,
    shipping_fee_idr NUMERIC(12, 2) NOT NULL,
    insurance_fee_idr NUMERIC(12, 2) NOT NULL DEFAULT 5000,
    grand_total_idr NUMERIC(12, 2) NOT NULL,
    
    -- Courier & Dispatch
    courier_code courier_service_enum NOT NULL,
    courier_service_name VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    
    -- Status
    order_status order_status_enum DEFAULT 'pending_payment',
    payment_method payment_method_enum DEFAULT 'bsi_transfer',
    payment_status VARCHAR(50) DEFAULT 'unverified',
    payment_proof_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. AUDIT & STATUS LOGS
CREATE TABLE order_status_logs (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    previous_status order_status_enum,
    new_status order_status_enum NOT NULL,
    changed_by_admin VARCHAR(100),
    change_reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. INDEXES FOR HIGH-THROUGHPUT LOOKUPS
CREATE INDEX idx_orders_code ON orders(order_code);
CREATE INDEX idx_orders_customer_wa ON customers(whatsapp_number);
CREATE INDEX idx_orders_status ON orders(order_status);

-- 9. SEED DATA FOR DEMONSTRATION
INSERT INTO products (slug, title_id, title_en, title_ar, publisher, store_name) VALUES 
('quran-al-muttaqin', 'Al-Qur''an Al-Muttaqin Tajwid Multikode & Waqaf Ibtida''', 'Al-Qur''an Al-Muttaqin Full Color Tajwid & Waqaf Ibtida''', 'القرآن الكريم - مصحف المتقين بالتجويد الملون والوقف والابتداء', 'Penerbit Al-Qosbah', 'Toko Al-Ibriez Book');

INSERT INTO product_variants (product_id, sku, name_id, name_en, name_ar, size_category, weight_kg, length_cm, width_cm, height_cm, price_idr, price_usd_approx) VALUES
(1, 'QOS-MTQ-A5', 'Al-Qur''an Al-Muttaqin Ukuran A5 Sedang (14.8 x 21 cm)', 'Al-Qur''an Al-Muttaqin Medium A5 Edition', 'مصحف المتقين مقاس A5 المتوسط', 'A5', 0.65, 14.8, 21.0, 2.5, 65000, 4.50),
(1, 'QOS-MTQ-A4', 'Al-Qur''an Al-Muttaqin Ukuran A4 Besar (21 x 30 cm)', 'Al-Qur''an Al-Muttaqin Large Desktop A4 Edition', 'مصحف المتقين مقاس A4 الكبير المكتبي', 'A4', 1.25, 21.0, 30.0, 3.0, 99000, 7.00),
(1, 'QOS-MTQ-BUNDLE', 'Paket Hemat Keluarga & Wakaf (1x A4 Jumbo + 1x A5 Standar)', 'Al-Muttaqin Family & Waqf Bundle (A4 + A5)', 'طقم المتقين للعائلة والوقف (مصحفان A4 + A5)', 'BUNDLE', 2.00, 22.0, 32.0, 7.0, 159000, 11.00);
