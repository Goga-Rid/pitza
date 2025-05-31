# === Сборка фронта ===
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === Финальный образ — только статика ===
FROM alpine:latest
WORKDIR /dist
COPY --from=build /app/dist .
EXPOSE 80