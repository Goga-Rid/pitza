# === Сборка фронта ===
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === Финальный этап — копирование в volume ===
FROM alpine:latest
WORKDIR /dist
COPY --from=build /app/dist ./

# Экспорт статики в volume
VOLUME ["/dist"]

# Команда, которая держит контейнер запущенным
CMD ["sh", "-c", "echo 'Frontend static files are ready in /dist'; sleep infinity"]