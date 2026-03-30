# Tareas pendientes

## 1. Admin: CRUD de Revistas

- [ ] Listado de revistas con tabla/grilla
- [ ] Formulario de creación (nombre, editorial, año, país, logo vía Cloudinary)
- [ ] Formulario de edición
- [ ] Eliminación con confirmación
- [ ] Generación automática de slug con slugify

## 2. Admin: CRUD de Autores

- [ ] Listado de autores
- [ ] Formulario de creación (nombre, bio, foto, fechas nacimiento/muerte)
- [ ] Formulario de edición
- [ ] Eliminación con confirmación

## 3. Admin: Gestión de Secciones y Keywords

- [ ] CRUD inline de secciones (crear, renombrar, eliminar)
- [ ] CRUD inline de keywords (crear, renombrar, eliminar)

## 4. Admin: CRUD de Artículos

- [ ] Listado con filtros (por revista, autor, sección)
- [ ] Formulario de creación con editor Tiptap (título, contenido HTML, excerpt)
- [ ] Selector de revista (requerido) y número (opcional)
- [ ] Selector múltiple de autores
- [ ] Selector múltiple de keywords
- [ ] Selector de sección
- [ ] Campo de URL de escaneo (scannedUrl)
- [ ] Formulario de edición
- [ ] Eliminación con confirmación

## 5. Admin: Gestión de Números (Issues)

- [ ] CRUD de números dentro de cada revista
- [ ] Número, título, fecha de publicación, tapa vía Cloudinary

## 6. Integración Cloudinary

- [ ] Helper para subir imágenes a Cloudinary (logos, tapas, fotos de autores)
- [ ] Componente de upload reutilizable para el admin

## 7. Páginas públicas

- [ ] Home: listado destacado de revistas y artículos recientes
- [ ] /revistas: grilla de revistas con logo y datos básicos
- [ ] /revistas/[slug]: detalle de revista con sus números y artículos
- [ ] /autores: listado de autores
- [ ] /autores/[slug]: detalle de autor con sus artículos
- [ ] /articulos/[slug]: vista de artículo con contenido HTML renderizado
- [ ] /secciones/[slug]: artículos filtrados por sección
- [ ] /keywords/[slug]: artículos filtrados por keyword

## 8. SEO y metadata

- [ ] generateMetadata en todas las páginas públicas
- [ ] generateStaticParams para las rutas dinámicas
- [ ] Open Graph tags
- [ ] Sitemap XML dinámico

## 9. Layout y navegación

- [ ] Layout público con header, navegación y footer
- [ ] Layout admin con sidebar de navegación
- [ ] Diseño responsive con Tailwind

## 10. Búsqueda

- [ ] Buscador de artículos (por título, contenido, autor)
- [ ] Página de resultados

## 11. Mejoras futuras

- [ ] Paginación en listados públicos y admin
- [ ] Importación masiva de artículos (CSV o similar)
- [ ] API pública (opcional)
- [ ] Estadísticas en el dashboard admin (conteos de revistas, artículos, autores)
