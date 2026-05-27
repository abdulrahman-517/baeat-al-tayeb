-- ============================================
-- متجر بائعة الطيب - Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  sizes TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  stock_quantity INTEGER DEFAULT 0,
  images_urls TEXT[] DEFAULT '{}',
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  type TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Admin Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Orders Log Table
-- ============================================
CREATE TABLE IF NOT EXISTS orders_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_details JSONB NOT NULL DEFAULT '[]',
  total_price DECIMAL(10, 2) NOT NULL,
  customer_info JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Seed Categories
-- ============================================
INSERT INTO categories (name, slug) VALUES
  ('الملابس', 'clothing'),
  ('البخور', 'incense'),
  ('العطور', 'perfumes')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for products and categories
CREATE POLICY "Public read access for products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  USING (true);

-- Admin-only write access for products
CREATE POLICY "Admin insert access for products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Admin-only access for orders_log
CREATE POLICY "Admin read access for orders_log"
  ON orders_log FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access for orders_log"
  ON orders_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin update access for orders_log"
  ON orders_log FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Admin-only access for admin_users
CREATE POLICY "Admin read access for admin_users"
  ON admin_users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for admin_users"
  ON admin_users FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================
-- Hero Images Table (for homepage carousel)
-- ============================================
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for hero_images"
  ON hero_images FOR SELECT
  USING (true);

CREATE POLICY "Admin insert access for hero_images"
  ON hero_images FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for hero_images"
  ON hero_images FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for hero_images"
  ON hero_images FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- Storage Bucket for Product Images
-- ============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public read access for product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated upload to product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated delete from product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_log_status ON orders_log(status);
CREATE INDEX IF NOT EXISTS idx_orders_log_created_at ON orders_log(created_at DESC);
