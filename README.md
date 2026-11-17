# Sourcelander Front

Frontend de la plataforma Sourcelander (marketplace de freelancers), construido con **Next.js 16** (App Router, Turbopack) + **React 19** + **Tailwind CSS 4** + **shadcn/ui (Radix)** + **Zustand** + **React Query**.

---

## Requisitos

- Node.js **22.x** (Next 16 exige >= 20.9)
- Backend Strapi corriendo (ver repo `sourcelander-backend-strapi`)

## Arranque local

```bash
npm ci          # instalar dependencias limpias desde el lockfile
npm run dev     # http://localhost:3200
npm run build   # build de producción (debe pasar sin errores)
npm run lint    # ESLint 10 (flat config), debe estar en 0 errores
```

### Variables de entorno (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_TOKEN=<token de la DB local — crearlo en el admin de Strapi>
```

> Los tokens son propios de cada DB: el token de producción NO sirve en local y viceversa.

---

## Conexión con el backend

- `src/services/axiosConfig.ts` — dos instancias de axios:
  - `apiInstance` → `NEXT_PUBLIC_API_URL` + `/api` (auth users-permissions, búsqueda).
  - `apiInstanceStrapi` → `NEXT_PUBLIC_STRAPI_URL` (contenido: categorías, artículos, home, global).
- Búsqueda de freelancers: `GET /api/search/freelancers?query=...` (endpoint público del backend; dispara el scraper si no hay caché fresca).
- ⚠️ La página `/freelancer` **no lee `?query=` de la URL** — el término vive en el store de Zustand (`src/store/search/searchStore.ts`) y se setea buscando desde el buscador de la UI.

---

## Estructura

```
src/
├── app/                  # App Router: páginas (/, /freelancer, /auth/*, /cart, /profile, ...)
├── components/
│   ├── ui/               # Componentes base shadcn/ui
│   ├── search/           # Cards, carousel de recomendados, modal
│   ├── common/           # Navbar, Footer, ProtectedRoute
│   └── modals/           # Checkout, verificación de email, etc.
├── hooks/                # useSearchResults, useInfiniteSearchResults, useAuthInit, useHydration
├── store/                # Zustand: auth, search, cart, project
├── services/             # axios config + auth service
├── lib/                  # utils, mocks (searchData, mockRecommended, mockCompanies)
├── interfaces/           # Tipos compartidos (UnifiedFreelancer, etc.)
└── middleware.ts         # Protección de rutas (en Next 16 renombrar a proxy.ts — ver pendientes)
```

## Convenciones relevantes

- **Hidratación**: patrones con `useSyncExternalStore` (`useHydration`), nunca `setState` sincrónico en `useEffect` (reglas react-hooks v6 — lint en 0 errores es criterio de merge).
- **Ids deterministas**: nada de `Math.random()` en render — usar `buildFreelancerFallbackId()` (`src/lib/utils.ts`).
- **Lectura de localStorage**: dentro de timers asíncronos en effects (hidratación-segura).

---

## Despliegue (Dokploy)

- Servicio **Frontend** (Application) → repo `GRAVITAD-SL/Sourcelander-Front-React`, rama `main`, Build Type: **Dockerfile** (Node 22, multi-stage).
- Las `NEXT_PUBLIC_*` **se hornean en el build**: se configuran en el tab **Environment** de Dokploy (Dokploy las escribe como `.env` en el build context; Next las lee automáticamente). El Dockerfile no declara `ARG/ENV` para no pisarlas con vacío.
- **Target stage**: vacío (usa el último stage `runner`).
- Producción:
  ```env
  NEXT_PUBLIC_API_URL=https://sourcelander-strapi.gravitad.com
  NEXT_PUBLIC_STRAPI_URL=https://sourcelander-strapi.gravitad.com/api
  NEXT_PUBLIC_STRAPI_TOKEN=<token de la DB de producción>
  ```
- Flujo: todo a `dev` → PR `dev → main` → merge → Dokploy re-despliega producción.
- Cambiar el token implica un **rebuild del front** (las NEXT_PUBLIC_* se hornean).

## Pendientes conocidos

- [ ] Migrar `src/middleware.ts` → `proxy.ts` (`npx @next/codemod@canary middleware-to-proxy .`) — la convención middleware está deprecada en Next 16.
- [ ] `/freelancer` soporte de `?query=` por URL.
- [ ] Warnings de `next/image` (width/height modificados con CSS) en Navbar/Footer.
