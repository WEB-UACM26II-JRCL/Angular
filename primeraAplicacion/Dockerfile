# Etapa 1: Build de la app Angular
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
# Copia el build de Angular
COPY --from=build /app/dist/primeraAplicacion/browser /usr/share/nginx/html
# Copia la configuracion de Nginx con proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
