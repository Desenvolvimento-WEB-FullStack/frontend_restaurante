# ---------- Etapa 1: build ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variáveis VITE_* são embutidas no bundle em tempo de build.
# No Coolify, marque VITE_URL_API como "Build Variable".
ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API

RUN npm run build

# ---------- Etapa 2: servidor estático ----------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
