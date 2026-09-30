# Edison 1632 — Catálogo de autos + Panel de administración

Sitio web de la concesionaria **Edison 1632**: catálogo público de autos y panel privado (ABM) para cargarlos.
Pensado para gente mayor: letra grande (base de 18px), alto contraste, botones amplios y formularios simples.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Radix UI · lucide-react · Supabase (DB, Auth, Storage) · React Hook Form + Zod.

## Funcionalidades

**Sitio público**
- Encabezado con dirección, teléfono y botón directo a WhatsApp.
- Portada con mensaje de confianza, buscador y tira de autos destacados.
- Filtros por marca, año, transmisión, combustible y rango de precio (funcionan sin JavaScript y quedan en la URL).
- Grilla de tarjetas con foto, año, km, combustible, caja y precio en USD o ARS.
- Detalle `/autos/[id]`: galería táctil (deslizar, flechas, miniaturas, pantalla completa), ficha técnica, descripción y botón **“Consultar por WhatsApp”** con mensaje prearmado (fijo abajo en celulares).
- Pie con contacto, horarios, mapa de Google Maps y acceso discreto a `/admin`.

**Panel `/admin`** (protegido por middleware + verificación en el servidor)
- Login con correo y contraseña (Supabase Auth).
- Listado con buscador, filtro por estado (Disponible / Reservado / Vendido), cambio rápido de estado, editar y eliminar con confirmación.
- Formulario de alta/edición (`/admin/nuevo`, `/admin/[id]/editar`) con validación, carga múltiple de fotos (arrastrar o elegir), previsualización inmediata, elegir foto principal y quitar fotos. Las fotos se comprimen en el navegador antes de subirse al bucket `vehiculos-fotos`.
- Mensajes grandes de resultado (“Auto guardado con éxito”, “Error al subir fotos”, etc.).

## Puesta en marcha

1. **Crear un proyecto en [Supabase](https://supabase.com).**
2. **Base de datos:** en *SQL Editor* ejecutar `supabase/schema.sql` (crea la tabla, las políticas RLS, el bucket `vehiculos-fotos` y sus políticas). Opcional: `supabase/seed.sql` carga autos de ejemplo.
3. **Usuario administrador:** en *Authentication → Users → Add user* crear el usuario (correo + contraseña, marcando “Auto confirm”).
   ⚠️ Desactivar el registro público en *Authentication → Sign In / Providers* (“Allow new users to sign up” = OFF): las políticas permiten editar a cualquier usuario autenticado.
4. **Variables de entorno:**
   ```bash
   cp .env.example .env.local
   # completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (Project Settings → API)
   ```
5. **Datos de la concesionaria:** editar `src/config/site.ts` (dirección, contactos con teléfono y WhatsApp, y horarios). El mapa se genera a partir de la dirección.
6. **Correr el proyecto:**
   ```bash
   npm install
   npm run dev      # http://localhost:3000
   ```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Compilar y servir en producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificación de tipos |

## Estructura

```
src/
  app/
    (publico)/            # Catálogo, detalle /autos/[id], header y footer
    admin/
      login/              # Ingreso
      (panel)/            # Listado, /nuevo y /[id]/editar (requieren sesión)
      actions.ts          # Server actions: guardar, cambiar estado, eliminar, salir
  components/
    ui/                   # Botón, inputs, badge, alerta, diálogo (estilo shadcn/ui)
    catalogo/             # Hero, filtros, tarjeta, galería
    admin/                # Login, listado, formulario, confirmación de borrado
  config/site.ts          # Datos de contacto de la concesionaria
  lib/                    # Supabase (cliente/servidor/middleware), validaciones Zod, consultas
  middleware.ts           # Protección de /admin/*
supabase/
  schema.sql              # Tabla, RLS y Storage
  seed.sql                # Datos de ejemplo
```

## Notas

- El catálogo muestra autos **Disponibles** y **Reservados**. Los **Vendidos** no aparecen en el listado, pero su página de detalle sigue accesible e indica que fue vendido.
- El filtro de precio aplica a los autos publicados en la moneda elegida (USD o ARS).
- Al quitar fotos de un auto ya guardado, se borran del almacenamiento recién al guardar los cambios; al eliminar un auto se borran también todas sus fotos.
- Para desplegar en Vercel, cargar las mismas variables de entorno del paso 4.
