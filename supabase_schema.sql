-- ============================================================================
-- KIRANASETU SUPABASE DATABASE SCHEMA (STEP 5)
-- ============================================================================

-- 1. SHOPS TABLE
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    distance_km NUMERIC(3,1) NOT NULL DEFAULT 0.5,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.7,
    review_count INTEGER NOT NULL DEFAULT 100,
    total_catalog_count INTEGER NOT NULL DEFAULT 50,
    has_previous_relationship BOOLEAN DEFAULT FALSE,
    trust_badge VARCHAR(255) DEFAULT 'Trusted Shop',
    trust_subtitle TEXT,
    badge_type VARCHAR(50) DEFAULT 'trusted',
    address TEXT NOT NULL,
    staff_delivery_fee NUMERIC(5,2) DEFAULT 15.00,
    partner_delivery_fee NUMERIC(5,2) DEFAULT 25.00,
    est_delivery_time VARCHAR(50) DEFAULT '20-30 mins',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    unit_size VARCHAR(100) NOT NULL,
    price NUMERIC(8,2) NOT NULL,
    image_icon VARCHAR(50) DEFAULT '📦',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INVENTORY TABLE (Shop ↔ Product Stock Mapping)
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE CASCADE,
    stock_quantity INTEGER NOT NULL DEFAULT 10,
    is_available BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id, product_id)
);

-- 4. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    pincode VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    items_subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(10,2) NOT NULL,
    delivery_mode VARCHAR(50) DEFAULT 'Kirana Shop Staff',
    status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, ACCEPTED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, REJECTED
    est_time VARCHAR(50) DEFAULT '30-45 mins',
    customer_name VARCHAR(255) NOT NULL,
    customer_location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES public.products(id),
    product_name VARCHAR(255) NOT NULL,
    unit_size VARCHAR(100),
    requested_qty INTEGER NOT NULL DEFAULT 1,
    price_per_unit NUMERIC(8,2) NOT NULL,
    item_total NUMERIC(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- 7. DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    delivery_mode VARCHAR(50) NOT NULL DEFAULT 'DELIVERY_PARTNER', -- SHOP_STAFF or DELIVERY_PARTNER
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- SUPABASE REALTIME PUBLICATION
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================
INSERT INTO public.shops (code, name, owner_name, distance_km, rating, review_count, has_previous_relationship, trust_badge, trust_subtitle, address, description)
VALUES 
('SHOP_SHARMA', 'SHARMA KIRANA', 'Ramesh Sharma', 0.5, 4.7, 142, TRUE, 'Your trusted local shop', 'You''ve ordered 6 times from this shop', 'Shop No. 12, Main Market, Sector 4', 'Serving neighborhood families for 18 years.'),
('SHOP_LAKSHMI', 'SRI LAKSHMI STORES', 'Venkatesh Rao', 0.8, 4.6, 98, FALSE, 'Nearby trusted-rated shop', 'Top 5% customer satisfaction in locality', 'Block C, Near Community Centre, Sector 4', 'High stock availability for daily staples.'),
('SHOP_GANESH', 'GANESH KIRANA', 'Ganesh Patel', 1.2, 4.8, 215, FALSE, 'Highly rated', '100% item availability record', 'Shop 4 & 5, Sector 5 Crossing', 'Full catalog availability with fast delivery.')
ON CONFLICT (code) DO NOTHING;

-- RLS POLICIES FOR SECURITY
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access Shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Public Read Access Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Access Inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Public Read Access Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public Read OrderItems" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Public Insert OrderItems" ON public.order_items FOR INSERT WITH CHECK (true);

-- 8. PUSH SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id VARCHAR(50) DEFAULT 'SHOP_SHARMA',
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public All Access PushSubscriptions" ON public.push_subscriptions FOR ALL USING (true);

