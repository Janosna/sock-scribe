-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- PRODUCTS ------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  short_description text not null default '',
  price numeric(10,2) not null,
  category text not null default 'socken',
  product_type text not null default 'personalizable',
  badge text,
  base_color text not null default 'Weiß',
  images text[] not null default '{}',
  popularity int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public products readable" on public.products for select to anon, authenticated using (active);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  stock_quantity int not null default 50
);
grant select on public.product_variants to anon, authenticated;
grant all on public.product_variants to service_role;
alter table public.product_variants enable row level security;
create policy "public variants readable" on public.product_variants for select to anon, authenticated using (true);

create table public.personalization_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  max_characters int not null default 15,
  available_thread_colors jsonb not null default '[]'::jsonb,
  available_fonts jsonb not null default '[]'::jsonb,
  available_motifs jsonb not null default '[]'::jsonb
);
grant select on public.personalization_options to anon, authenticated;
grant all on public.personalization_options to service_role;
alter table public.personalization_options enable row level security;
create policy "public personalization readable" on public.personalization_options for select to anon, authenticated using (true);

-- CUSTOMERS / ORDERS --------------------------------------------------
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now()
);
grant insert on public.customers to anon, authenticated;
grant all on public.customers to service_role;
alter table public.customers enable row level security;
create policy "anyone can create customer" on public.customers for insert to anon, authenticated with check (true);
create policy "admins read customers" on public.customers for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('#' || nextval('public.order_number_seq')::text),
  user_id uuid,
  customer_email text not null,
  customer_first_name text not null,
  customer_last_name text not null,
  shipping_address jsonb not null,
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_status text not null default 'pending',
  production_status text not null default 'offen',
  shipping_status text not null default 'nicht_versendet',
  stripe_session_id text,
  created_at timestamptz not null default now()
);
grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "anyone can create order" on public.orders for insert to anon, authenticated
  with check (payment_status = 'pending' and production_status = 'offen' and shipping_status = 'nicht_versendet');
create policy "admins read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "own orders readable" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "admins update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name text not null default '',
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  size text,
  color text,
  personalization_text text,
  thread_color text,
  font text,
  personalization_details jsonb not null default '{}'::jsonb
);
grant insert on public.order_items to anon, authenticated;
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "anyone can create order items" on public.order_items for insert to anon, authenticated with check (true);
create policy "admins read order items" on public.order_items for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "own order items readable" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- SEED ----------------------------------------------------------------
insert into public.products (slug, name, description, short_description, price, category, product_type, badge, base_color, images, popularity) values
('classic-white', 'Classic White', 'Unser Klassiker aus gekämmter Bio-Baumwolle. Weich, atmungsaktiv und formstabil – die perfekte Basis für deine persönliche Stickerei. Jede Socke wird nach deiner Bestellung von Hand vorbereitet und bestickt.', 'Weiche Rippsocke aus Bio-Baumwolle, individuell bestickbar.', 17.00, 'personalisierbar', 'personalizable', 'Bestseller', 'Weiß', array['/images/product-classic-white.jpg','/images/hero-socks.jpg'], 100),
('classic-black', 'Classic Black', 'Tiefschwarz, dicht gestrickt und alltagstauglich. Deine Stickerei setzt hier einen besonders schönen Kontrast – ob Name, Datum oder ein kurzes Wort.', 'Dichte schwarze Rippsocke, individuell bestickbar.', 17.00, 'personalisierbar', 'personalizable', 'Neu', 'Schwarz', array['/images/product-classic-black.jpg','/images/hero-socks.jpg'], 90),
('love-socks', 'Love Socks', 'Ein kleines rotes Herz auf naturweißer Baumwolle. Fertig bestickt und sofort versandbereit – für Menschen, die man sehr gern hat.', 'Naturweiße Socke mit fein besticktem Herz.', 17.00, 'fertig-bestickt', 'ready_made', 'Bestseller', 'Creme', array['/images/product-love.jpg'], 80),
('mama-socks', 'Mama Socks', 'Ein Wort, das alles sagt. Fein bestickt auf weicher Melange-Baumwolle – unser meistverschenktes Modell.', 'Melierte Socke mit Stickerei „MAMA".', 17.00, 'geschenke', 'ready_made', null, 'Grau', array['/images/product-mama.jpg'], 70);

insert into public.product_variants (product_id, size, color)
select p.id, s.size, p.base_color from public.products p
cross join (values ('35-38'),('39-42'),('43-46')) as s(size);

insert into public.personalization_options (product_id, max_characters, available_thread_colors, available_fonts, available_motifs)
select p.id, 15,
 '[{"name":"Weiß","hex":"#ffffff"},{"name":"Schwarz","hex":"#111111"},{"name":"Terracotta","hex":"#c2603f"},{"name":"Salbei","hex":"#8a9a7b"},{"name":"Gold","hex":"#c9a227"}]'::jsonb,
 '["Serif","Sans","Script"]'::jsonb,
 '[]'::jsonb
from public.products p where p.product_type = 'personalizable';

insert into public.personalization_options (product_id, max_characters, available_thread_colors, available_fonts, available_motifs)
select p.id, 0, '[]'::jsonb, '[]'::jsonb,
  case when p.slug = 'love-socks' then '["Herz rot","Herz schwarz"]'::jsonb else '["MAMA","MAMA seit 2020"]'::jsonb end
from public.products p where p.product_type = 'ready_made';