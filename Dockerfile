# syntax=docker/dockerfile:1

# 1) Dependencias
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# 2) Build
# Las NEXT_PUBLIC_* se hornean en el build: se reciben como build args
# (en Dokploy: Settings -> Build -> Build Args) y se fijan como ENV antes
# de compilar, o la app saldría con URLs undefined.
FROM node:22-alpine AS builder
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_STRAPI_TOKEN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_STRAPI_TOKEN=$NEXT_PUBLIC_STRAPI_TOKEN
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Si usas output: 'standalone'
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/static ./.next/static
# CMD ["node", "server.js"]

# Si NO usas 'standalone', copia artefactos necesarios:
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]
