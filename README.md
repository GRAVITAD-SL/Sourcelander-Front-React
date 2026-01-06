# 🛒 Next.js eCommerce + Blog

Proyecto web completo y escalable construido con Next.js 14+, arquitectura modular por dominios (features), y componentes reutilizables con shadcn/ui.

---

## Iniciar servidor de desarrollo

- `npm run dev`: Iniciar servidor de desarrollo
- `npm run test`: Ejecutar tests unitarios
- `npm run build`: Compilar build de producción
- `npm run lint && npm run format`: Linter + formateo

---

## Environment Variables

### Development (.env.local)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_TOKEN=your-strapi-api-token
```

### Production

```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com/api
NEXT_PUBLIC_STRAPI_TOKEN=your-production-api-token
```

> **Note**: Generate the API token in Strapi Admin → Settings → API Tokens

---

## 🧱 Arquitectura del Proyecto

El proyecto sigue una arquitectura **modular por dominio (DDD)** combinada con componentes compartidos:

- `app/`: rutas del frontend, con layout por rol (admin, user)
- `features/`: módulos independientes como auth, productos, carrito, etc.
- `components/ui/`: base UI reutilizable (con shadcn/ui)
- `hooks/`, `lib/`, `store/`, `types/`: herramientas compartidas entre features

Esta arquitectura permite:

- Separación clara de responsabilidades
- Escalabilidad horizontal por dominio
- Reutilización de lógica y UI

---

## 🧩 Estructura de Carpetas

```txt
.
├── app/                     # Rutas y layouts de Next.js
│   ├── admin/              # Panel admin (protegido)
│   ├── user/               # Panel usuario (protegido)
│   ├── auth/               # Login / registro
│   ├── shop/               # Tienda pública
│   ├── blog/               # Blog
│   ├── api/                # Rutas API (Next.js handlers)
│   └── layout.tsx          # Layout global

├── components/
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── layout/             # Navbar, footer, sidebar
│   └── icons/              # SVGs personalizados

├── features/
│   ├── auth/               # Módulo de autenticación
│   ├── products/           # Módulo de productos
│   ├── cart/               # Carrito de compras
│   └── orders/             # Pedidos

├── hooks/                  # Hooks globales (useAuth, useDebounce, etc.)
├── lib/                    # Lógica auxiliar (api.ts, auth.ts, utils.ts)
├── store/                  # Estado global con Zustand
├── types/                  # Tipos globales compartidos
├── public/                 # Archivos estáticos (logos, imágenes)
├── tests/                  # Tests de integración o flujo (opcional)

├── middleware.ts           # Protección de rutas por rol
├── next.config.js
├── tailwind.config.ts
├── vitest.config.ts
└── README.md               # Este archivo
```
