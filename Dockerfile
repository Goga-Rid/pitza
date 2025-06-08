# === Сборка фронта ===
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === Финальный этап — только статика ===
FROM alpine:latest
WORKDIR /dist
COPY --from=build /app/dist /dist
