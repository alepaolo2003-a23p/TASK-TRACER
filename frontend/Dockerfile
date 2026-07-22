# === STAGE 1: Build ===
# FROM node para instalar dependencias y compilar el frontend
FROM node:20-alpine AS build

WORKDIR /app

# COPY package.json y package-lock.json primero para cachear capa de npm install
COPY package.json package-lock.json* ./
RUN npm ci

# COPY del código fuente y compilación
COPY . .
RUN npm run build

# === STAGE 2: Run with Nginx ===
# Servimos los archivos estáticos con Nginx en vez de Vite dev server
# Nginx es mucho más eficiente para servir contenido estático en producción
FROM nginx:1.26-alpine

# COPY la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY los archivos compilados desde la etapa build a la carpeta que sirve Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
