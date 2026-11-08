# Versão final — multi-stage: Node só para BUILDAR, Nginx para SERVIR
# ---------- estágio 1: build ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_* é lida no momento do BUILD e fica gravada dentro do JS gerado.
# Passar -e VITE_URL_API no "docker run" NÃO adianta.
ARG VITE_URL_API
RUN npm run build

# ---------- estágio 2: servidor estático ----------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
# CMD já vem da imagem do nginx
