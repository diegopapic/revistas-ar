# revistas-ar

Archivo digital de revistas argentinas. Permite catalogar revistas, números, artículos, autores, secciones y keywords. Tiene un panel de administración protegido con autenticación y un sitio público de lectura.

## Stack

- **Framework**: Next.js 16 con App Router, TypeScript strict
- **Estilos**: Tailwind CSS
- **Base de datos**: PostgreSQL con Prisma ORM
- **Auth**: NextAuth v5 (credentials provider, un solo usuario admin via env vars)
- **Editor**: Tiptap (rich text, output HTML)
- **Deploy**: Docker (standalone output) en Hetzner, CI/CD con GitHub Actions
- **Puerto producción**: 3002 (el 3001 lo usa Uptime Kuma)

## Estructura

```
src/app/
  (public)/          # Rutas públicas (server components)
    page.tsx         # Home
    revistas/        # Listado y detalle de revistas
    autores/         # Listado y detalle de autores
    articulos/       # Detalle de artículos
    secciones/       # Artículos por sección
    keywords/        # Artículos por keyword
  (admin)/admin/     # Panel admin (client components)
    articulos/       # CRUD artículos
    revistas/        # CRUD revistas
    autores/         # CRUD autores
    secciones/       # Gestión secciones
    keywords/        # Gestión keywords
  login/             # Login page
  api/auth/          # NextAuth API routes
src/lib/
  db.ts              # Singleton Prisma client
  auth.ts            # Configuración NextAuth
src/proxy.ts         # Middleware que protege /admin/*
```

## Modelos principales

- **Magazine**: revista con nombre, slug, editorial, año fundación
- **Issue**: número de una revista, con fecha y tapa
- **Article**: artículo con contenido HTML (Tiptap), asociado a revista, opcionalmente a número, sección, autores y keywords
- **Author**: autor con bio, foto, fechas de nacimiento/muerte
- **Section** y **Keyword**: taxonomías para artículos

## Workflow

- No pedir permiso para editar archivos ni para ejecutar comandos. Hacer todo directamente.
- Después de terminar cada implementación, correr en este orden:
  1. `npm run lint` (ESLint)
  2. `npm run format` (Prettier — formatea automáticamente)
  3. `npm run build`
- Si todo pasa, hacer commit y push a main automáticamente (sin pedir confirmación).

## Convenciones

- Los slugs se generan automáticamente con `slugify` al crear entidades
- El campo `content` de Article almacena HTML (output de Tiptap), no markdown
- Las páginas públicas son server components; el admin usa client components
- La DB se comparte con cinenacional en el mismo PostgreSQL (container `cinenacional-db`), base `revistas_ar`

## Comandos útiles

```bash
npm run dev          # Dev server local
npm run build        # Build de producción
npx prisma studio    # UI para ver/editar datos
npx prisma migrate dev --name nombre  # Nueva migración
```

## Infraestructura

- **VPS**: Hetzner, IP 5.161.58.106
- **Red Docker**: `cinenacional_cinenacional-network` (red compartida)
- **Deploy**: push a main → GitHub Actions → SSH al VPS → git pull + docker compose build + up
