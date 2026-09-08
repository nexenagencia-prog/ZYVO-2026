create extension if not exists pgcrypto;

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid null references auth.users(id),
  unique(section, key)
);

create table if not exists public.carousel_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  subtitle text not null default '',
  image_url text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_cards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  percentage int not null check (percentage between 0 and 100),
  image_url text not null default '',
  cta_label text not null default 'Explorar',
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  email text primary key,
  must_change_password boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.carousel_items enable row level security;
alter table public.home_cards enable row level security;
alter table public.admin_users enable row level security;

-- Public Home reads only content intended for display.
drop policy if exists "zyvo site content public read" on public.site_content;
create policy "zyvo site content public read" on public.site_content for select using (true);

drop policy if exists "zyvo carousel read" on public.carousel_items;
create policy "zyvo carousel read" on public.carousel_items for select using (
  is_active or coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com'
);

drop policy if exists "zyvo cards read" on public.home_cards;
create policy "zyvo cards read" on public.home_cards for select using (
  is_active or coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com'
);

drop policy if exists "zyvo admin row self" on public.admin_users;
create policy "zyvo admin row self" on public.admin_users for select using (
  lower(email) = lower(coalesce((select auth.jwt())->>'email','')) and lower(email) = 'sandrobellomind@gmail.com'
);

-- Writes are limited to the single approved CMS administrator.
drop policy if exists "zyvo site content admin write" on public.site_content;
create policy "zyvo site content admin write" on public.site_content for all to authenticated
using (coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com')
with check (coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com');

drop policy if exists "zyvo carousel admin write" on public.carousel_items;
create policy "zyvo carousel admin write" on public.carousel_items for all to authenticated
using (coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com')
with check (coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com');

drop policy if exists "zyvo cards admin write" on public.home_cards;
create policy "zyvo cards admin write" on public.home_cards for all to authenticated
using (coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com')
with check (coalesce((select auth.jwt())->>'email','') = 'sandrobellomind@gmail.com');

drop policy if exists "zyvo admin row update" on public.admin_users;
create policy "zyvo admin row update" on public.admin_users for update to authenticated
using (lower(email) = lower(coalesce((select auth.jwt())->>'email','')) and lower(email) = 'sandrobellomind@gmail.com')
with check (lower(email) = 'sandrobellomind@gmail.com');

insert into public.admin_users(email, must_change_password)
values ('sandrobellomind@gmail.com', true)
on conflict (email) do nothing;

insert into public.site_content(section,key,value) values
('hero','eyebrow',to_jsonb('| Videoconferência de alta performance'::text)),
('hero','title',to_jsonb(E'Converse, evolua\ne alcance resultados\nem cada reunião.'::text)),
('hero','ratingText',to_jsonb('Maior performance em reuniões.'::text)),
('hero','performancePercent','69'::jsonb),
('hero','performanceLabel',to_jsonb('de performance'::text)),
('hero','primaryButton',to_jsonb('Criar reunião'::text)),
('hero','secondaryButton',to_jsonb('Entrar'::text)),
('nextMeeting','label',to_jsonb('Seu próximo encontro'::text)),
('nextMeeting','dateTime',to_jsonb('14:00 — 30 Set 2026'::text)),
('profile','name',to_jsonb('Sandro Bello'::text)),
('profile','avatarUrl',to_jsonb(''::text)),
('profile','planLabel',to_jsonb('ZYVO Pro'::text)),
('navigation','searchPlaceholder',to_jsonb('Buscar reunião, pessoa ou gravação...'::text)),
('navigation','top','["Início","Skills","Agenda","Planos e Preços"]'::jsonb),
('navigation','sidebar','["Início","Criar reunião","Agenda","Skills","Contatos","Notificações","Gravações","Configurações","Sair"]'::jsonb),
('settings','carouselIntervalMs','4000'::jsonb)
on conflict (section,key) do nothing;

insert into public.carousel_items(title,subtitle,image_url,sort_order,is_active)
select * from (values
('Mais do que reuniões.','Evolução.','',0,true),
('Performance que evolui','com você.','',1,true),
('Dados que viram','melhores decisões.','',2,true)
) as v(title,subtitle,image_url,sort_order,is_active)
where not exists (select 1 from public.carousel_items);

insert into public.home_cards(slug,title,description,percentage,image_url,cta_label,sort_order,is_active) values
('skills','Skills','Analise suas reuniões, receba feedback e evolua com IA.',82,'https://raw.githubusercontent.com/nexenagencia-prog/ZYVO-2026/fa1814b2cdf961ad2327098e3d77581babb9f157/public/card-skills.webp','Explorar',0,true),
('recordings','Gravações','Reviva conversas, identifique pontos-chave e gere insights.',54,'https://raw.githubusercontent.com/nexenagencia-prog/ZYVO-2026/fa1814b2cdf961ad2327098e3d77581babb9f157/public/card-recordings.webp','Explorar',1,true),
('insights','Insights','Transforme conversas em decisões mais inteligentes.',76,'https://raw.githubusercontent.com/nexenagencia-prog/ZYVO-2026/fa1814b2cdf961ad2327098e3d77581babb9f157/public/card-insights.webp','Explorar',2,true)
on conflict (slug) do nothing;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('cms-media','cms-media',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=10485760,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "zyvo cms media public read" on storage.objects;
create policy "zyvo cms media public read" on storage.objects for select using (bucket_id='cms-media');

drop policy if exists "zyvo cms media admin insert" on storage.objects;
create policy "zyvo cms media admin insert" on storage.objects for insert to authenticated
with check (bucket_id='cms-media' and coalesce((select auth.jwt())->>'email','')='sandrobellomind@gmail.com');

drop policy if exists "zyvo cms media admin update" on storage.objects;
create policy "zyvo cms media admin update" on storage.objects for update to authenticated
using (bucket_id='cms-media' and coalesce((select auth.jwt())->>'email','')='sandrobellomind@gmail.com')
with check (bucket_id='cms-media' and coalesce((select auth.jwt())->>'email','')='sandrobellomind@gmail.com');

drop policy if exists "zyvo cms media admin delete" on storage.objects;
create policy "zyvo cms media admin delete" on storage.objects for delete to authenticated
using (bucket_id='cms-media' and coalesce((select auth.jwt())->>'email','')='sandrobellomind@gmail.com');
