-- =====================================================================
-- Edison 1632 - Esquema de base de datos para Supabase
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query.
-- Es idempotente: se puede volver a ejecutar sin romper nada.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tabla de vehículos
-- ---------------------------------------------------------------------
create table if not exists public.vehiculos (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  version text,
  anio int not null,
  kilometraje int not null,
  combustible text not null,
  transmision text not null,
  precio numeric,
  moneda text default 'USD',
  estado text default 'Disponible', -- 'Disponible', 'Reservado', 'Vendido'
  destacado boolean default false,
  descripcion text,
  imagenes text[] default array[]::text[],
  created_at timestamp with time zone default now(),

  constraint vehiculos_combustible_check check (combustible in ('Nafta', 'Diésel', 'GNC', 'Híbrido')),
  constraint vehiculos_transmision_check check (transmision in ('Manual', 'Automática')),
  constraint vehiculos_moneda_check check (moneda in ('USD', 'ARS')),
  constraint vehiculos_estado_check check (estado in ('Disponible', 'Reservado', 'Vendido')),
  constraint vehiculos_anio_check check (anio between 1900 and 2100),
  constraint vehiculos_kilometraje_check check (kilometraje >= 0),
  constraint vehiculos_precio_check check (precio is null or precio > 0)
);

comment on table public.vehiculos is 'Autos publicados por la concesionaria Edison 1632.';

-- Índices para el catálogo y los filtros.
create index if not exists vehiculos_estado_idx on public.vehiculos (estado);
create index if not exists vehiculos_destacado_created_idx on public.vehiculos (destacado desc, created_at desc);
create index if not exists vehiculos_marca_idx on public.vehiculos (lower(marca));

-- ---------------------------------------------------------------------
-- 2. Row Level Security (RLS)
-- ---------------------------------------------------------------------
alter table public.vehiculos enable row level security;

-- Lectura pública (visitantes anónimos y usuarios logueados)
-- de vehículos Disponibles / Reservados / Vendidos.
drop policy if exists "Lectura publica de vehiculos" on public.vehiculos;
create policy "Lectura publica de vehiculos"
  on public.vehiculos
  for select
  to anon, authenticated
  using (estado in ('Disponible', 'Reservado', 'Vendido'));

-- Alta, modificación y baja: solo usuarios autenticados.
drop policy if exists "Alta de vehiculos solo autenticados" on public.vehiculos;
create policy "Alta de vehiculos solo autenticados"
  on public.vehiculos
  for insert
  to authenticated
  with check (true);

drop policy if exists "Edicion de vehiculos solo autenticados" on public.vehiculos;
create policy "Edicion de vehiculos solo autenticados"
  on public.vehiculos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Baja de vehiculos solo autenticados" on public.vehiculos;
create policy "Baja de vehiculos solo autenticados"
  on public.vehiculos
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 3. Storage: bucket público para las fotos
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehiculos-fotos',
  'vehiculos-fotos',
  true,
  15728640, -- 15 MB por archivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Cualquiera puede ver las fotos.
drop policy if exists "Fotos de vehiculos: lectura publica" on storage.objects;
create policy "Fotos de vehiculos: lectura publica"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'vehiculos-fotos');

-- Solo usuarios autenticados pueden subir, reemplazar o borrar fotos.
drop policy if exists "Fotos de vehiculos: subir solo autenticados" on storage.objects;
create policy "Fotos de vehiculos: subir solo autenticados"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'vehiculos-fotos');

drop policy if exists "Fotos de vehiculos: editar solo autenticados" on storage.objects;
create policy "Fotos de vehiculos: editar solo autenticados"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'vehiculos-fotos')
  with check (bucket_id = 'vehiculos-fotos');

drop policy if exists "Fotos de vehiculos: borrar solo autenticados" on storage.objects;
create policy "Fotos de vehiculos: borrar solo autenticados"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'vehiculos-fotos');

-- ---------------------------------------------------------------------
-- IMPORTANTE: como cualquier usuario autenticado puede editar,
-- desactivá el registro público en Authentication → Sign In / Providers
-- ("Allow new users to sign up" = OFF) y creá el usuario administrador
-- a mano desde Authentication → Users → Add user.
-- ---------------------------------------------------------------------
