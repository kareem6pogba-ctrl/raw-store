-- ============================================================
-- RAW — Supabase schema + seed data
-- Run this entire file in Supabase SQL Editor (one paste, Run)
-- ============================================================

-- ---------- PRODUCTS ----------
create table if not exists products (
  id text primary key,
  name text not null,
  price numeric not null,
  category text not null,
  description text,
  fabric text,
  colors jsonb not null default '[]',   -- [{name, hex}]
  sizes jsonb not null default '[]',    -- ["XS","S","M","L"]
  image_main text,
  image_alt text,
  tag text,
  is_published boolean default true,
  stock integer default 100,
  created_at timestamptz default now()
);

-- ---------- CUSTOMERS ----------
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  phone text,
  address text,
  city text,
  created_at timestamptz default now()
);

-- ---------- ORDERS ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  email text,
  phone text,
  address text,
  city text,
  country text default 'Egypt',
  subtotal numeric not null,
  shipping numeric not null default 0,
  discount numeric default 0,
  coupon_code text,
  total numeric not null,
  payment_method text not null default 'cod',
  status text not null default 'pending', -- pending, confirmed, packed, shipped, delivered, cancelled, returned
  notes text,
  created_at timestamptz default now()
);

-- ---------- ORDER ITEMS ----------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text references products(id),
  product_name text not null,
  color text,
  size text,
  quantity integer not null,
  unit_price numeric not null
);

-- ---------- COUPONS ----------
create table if not exists coupons (
  code text primary key,
  type text not null default 'percentage', -- percentage | fixed
  amount numeric not null,
  min_order numeric default 0,
  usage_limit integer,
  times_used integer default 0,
  expires_at timestamptz,
  active boolean default true
);

-- ============================================================
-- ROW LEVEL SECURITY — allow public read on products,
-- allow public insert on orders/order_items/customers (storefront),
-- block public writes to products/coupons (admin-only later)
-- ============================================================
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table coupons enable row level security;

create policy "public read products" on products
  for select using (is_published = true);

create policy "public insert customers" on customers
  for insert with check (true);

create policy "public insert orders" on orders
  for insert with check (true);

create policy "public insert order_items" on order_items
  for insert with check (true);

create policy "public read coupons" on coupons
  for select using (active = true);

-- ============================================================
-- SEED DATA — matches the current storefront demo
-- ============================================================
insert into products (id, name, price, category, description, fabric, colors, sizes, image_main, image_alt, tag)
values
('puff-blouse','Puff Sleeve Blouse',1450,'Tops',
 'Lightweight cotton voile, gathered puff sleeves, relaxed cropped body. Cut for movement, made to soften with every wash.',
 '100% Cotton Voile',
 '[{"name":"Ivory","hex":"#F4EDE2"},{"name":"Beige","hex":"#C9A876"},{"name":"Sage","hex":"#7A8471"},{"name":"Espresso","hex":"#3A2418"}]',
 '["XS","S","M","L"]',
 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1200&auto=format&fit=crop',
 'New'),

('linen-trouser','Wide Linen Trouser',1650,'Bottoms',
 'Heavyweight European linen with a high, fluid waist and a leg that moves like water. Unlined for warm-weather ease.',
 '100% Linen',
 '[{"name":"Sand","hex":"#DCCBAE"},{"name":"Espresso","hex":"#3A2418"}]',
 '["XS","S","M","L","XL"]',
 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop',
 'Best Seller'),

('raw-tee','Undyed Raw Tee',850,'Tops',
 'Left in its natural, undyed state — every piece carries a slightly different cast. Heavyweight jersey, boxy fit.',
 'Organic Cotton Jersey',
 '[{"name":"Raw Natural","hex":"#E8DCC4"},{"name":"Espresso","hex":"#3A2418"}]',
 '["XS","S","M","L","XL"]',
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop',
 null),

('sage-wrap','Sage Wrap Skirt',1250,'Bottoms',
 'A single length of washed cotton twill, wrapped and tied. No two ways of wearing it look quite the same.',
 'Washed Cotton Twill',
 '[{"name":"Sage","hex":"#7A8471"},{"name":"Beige","hex":"#C9A876"}]',
 '["XS","S","M","L"]',
 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop',
 null),

('linen-shirt','Oversized Linen Shirt',1550,'Tops',
 'A borrowed-from-the-boys shirt in stonewashed linen. Dropped shoulder, single chest pocket, worn open or buttoned through.',
 'Stonewashed Linen',
 '[{"name":"Ivory","hex":"#F4EDE2"},{"name":"Sand","hex":"#DCCBAE"}]',
 '["S","M","L","XL"]',
 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1489533119213-66a5cd877091?q=80&w=1200&auto=format&fit=crop',
 'Best Seller'),

('cotton-set','Two-Piece Cotton Set',2100,'Sets',
 'A cropped top and matching wide trouser in the same undyed cotton. Worn together or apart, endlessly.',
 'Organic Cotton',
 '[{"name":"Raw Natural","hex":"#E8DCC4"},{"name":"Espresso","hex":"#3A2418"}]',
 '["XS","S","M","L"]',
 'https://images.unsplash.com/photo-1544957992-20514f595d6f?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1200&auto=format&fit=crop',
 'New')
on conflict (id) do nothing;

insert into coupons (code, type, amount, min_order, usage_limit, active)
values ('WELCOME10', 'percentage', 10, 500, 500, true)
on conflict (code) do nothing;

-- ============================================================
-- ADMIN WRITE POLICIES — run this second block after creating
-- your admin login user (Authentication -> Users -> Add user)
-- Grants any authenticated user (i.e. your admin login) the
-- ability to manage products and update orders.
-- ============================================================
create policy "admin manage products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin read all orders" on orders
  for select using (auth.role() = 'authenticated');

create policy "admin update orders" on orders
  for update using (auth.role() = 'authenticated');

create policy "admin read order_items" on order_items
  for select using (auth.role() = 'authenticated');

create policy "admin read customers" on customers
  for select using (auth.role() = 'authenticated');

create policy "admin manage coupons" on coupons
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
