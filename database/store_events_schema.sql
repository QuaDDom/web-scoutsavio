-- =====================================================
-- Scout Store & Events Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PRODUCTS TABLE (Tienda Scout)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10, 2) NOT NULL,
  discount_percent INTEGER DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  category VARCHAR(50) NOT NULL CHECK (category IN ('uniforms', 'accessories', 'camping', 'other')),
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(255)
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Admin full access via service role key (handled in API)

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  user_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size VARCHAR(20),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for order lookup
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items from their own orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- =====================================================
-- EVENTS TABLE (Blog de Eventos)
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  content TEXT,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('activity', 'fundraiser', 'meeting', 'camp', 'celebration', 'other')),
  location VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_is_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events(is_featured);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public read access for published events
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (is_published = true);

-- =====================================================
-- SAMPLE DATA (Optional - uncomment to insert)
-- =====================================================

/*
-- Sample Products
INSERT INTO products (name, description, price, discount_percent, category, sizes, stock, images, is_active) VALUES
('Pasapañuelo Scout', 'Pasapañuelo oficial del Grupo Scout 331 Savio con escudo bordado', 1500, 0, 'accessories', '{}', 50, ARRAY['https://example.com/pasapahuelo.jpg'], true),
('Camisa Scout', 'Camisa de uniforme scout color beige', 8500, 10, 'uniforms', ARRAY['XS', 'S', 'M', 'L', 'XL'], 30, ARRAY['https://example.com/camisa.jpg'], true),
('Mochila de Campamento', 'Mochila de 60L resistente al agua', 25000, 15, 'camping', '{}', 10, ARRAY['https://example.com/mochila.jpg'], true),
('Pañoleta Scout', 'Pañoleta cuadrada colores representativos', 2500, 0, 'accessories', '{}', 100, ARRAY['https://example.com/pañoleta.jpg'], true);

-- Sample Events
INSERT INTO events (title, subtitle, content, event_date, event_type, location, is_featured, is_published) VALUES
('Peña de Fin de Año', 'Celebramos juntos el cierre del año scout', '<p>¡Vení a celebrar con nosotros! Habrá comida, música y muchas sorpresas.</p>', '2024-12-15 20:00:00+00', 'celebration', 'Sede Scout - Av. Principal 123', true, true),
('Venta de Empanadas', 'Recaudación de fondos para el campamento', '<p>Ayudanos a juntar fondos comprando las mejores empanadas de la zona.</p>', '2024-10-20 11:00:00+00', 'fundraiser', 'Plaza Central', false, true),
('Campamento de Verano', 'Aventura en la montaña', '<p>Tres días de aventura, fuegos de campamento y naturaleza.</p>', '2025-01-15 08:00:00+00', 'camp', 'Cerro Uritorco, Capilla del Monte', true, true);
*/

-- =====================================================
-- GRANT PERMISSIONS (for service role)
-- These are handled automatically by Supabase for admin operations
-- =====================================================
