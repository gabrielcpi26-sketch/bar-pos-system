# Bar POS System

Plataforma integral para bares con módulos de punto de venta, pedidos desde el celular, inventario inteligente y paneles por rol.

## Estructura

- `backend/` API REST en Express + Supabase (servicio de datos y auth)
- `frontend/` Next.js (App Router) + Tailwind (tema oscuro) + supabase-js
- `scripts/supabase.sql` Esquema completo, relaciones y políticas RLS
- `scripts/qr-generator.js` Generador de QR por mesa

## Requerimientos

- Node.js 18+
- Cuenta/proyecto en Supabase

## Instalación rápida

1. Clona el repo y duplica variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Crea un proyecto en Supabase y pega `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en `backend/.env` y variables `NEXT_PUBLIC_*` en `frontend/.env.local`.
3. Ejecuta el esquema:
   ```bash
   supabase db push --file scripts/supabase.sql
   # o pega el contenido en el SQL editor de Supabase
   ```
4. Instala dependencias:
   ```bash
   (cd backend && npm install)
   (cd frontend && npm install)
   ```
5. Arranca backend y frontend en paralelo:
   ```bash
   (cd backend && npm run dev)
   (cd frontend && npm run dev)
   ```
6. Genera un QR por mesa (usa la URL pública del frontend):
   ```bash
   CLIENT_BASE_URL=https://tu-dominio.com/public node scripts/qr-generator.js mesa-7
   ```

## Notas funcionales

- Inventario se descuenta automáticamente según recetas al crear orden.
- Si un ingrediente llega al umbral, se registra alerta en `stock_movements`.
- Menú público lee productos (RLS permite lectura pública) y envía orden asociada a la mesa.
- Paneles por rol:
  - `/admin` gestión de productos e indicadores rápidos
  - `/mesero` control de mesas y órdenes recientes
  - `/barra` tickets de barra
  - `/cocina` tickets de cocina
  - `/public` mini app cliente

## API REST (backend)

- `POST /login` autenticación Supabase
- `GET/POST/PATCH /mesas`
- `GET/POST/PATCH /ordenes`
- `GET/PATCH /inventario`
- `GET/POST/PATCH /productos`
- `GET/POST /usuarios`
- `GET /reportes/ventas-dia`
- `GET /reportes/top-productos`

## Mapa de navegación

- Inicio → accesos rápidos por rol
- Clientes `/public` → Menú, carrito, enviar orden, ver total
- Mesero `/mesero` → mesas y órdenes, divide/trasfiere (extensible)
- Barra `/barra` → comandas, marcar listo
- Cocina `/cocina` → comandas de cocina, estados
- Admin `/admin` → catálogo, inventario, reportes

## Supabase Auth y RLS

- Usuarios viven en `auth.users`; la tabla `users` enlaza rol.
- Policies permiten lectura pública de menú/mesas y acceso total para `service_role` desde el backend.
- Ajusta policies según tus necesidades de permisos finos por rol.

## Estilos y UI

- Tailwind con tema oscuro y acentos en morado.
- Componentes reutilizables básicos (`card`, `btn`) definidos en `globals.css`.

## Roadmap sugerido

- Integrar impresión de tickets y pagos QR.
- Añadir cálculos de happy hour y propinas en `orders` y `payments`.
- Conectar sockets o supabase realtime para notificaciones instantáneas.
