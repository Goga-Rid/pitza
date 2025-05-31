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

# Очистка старых файлов (например, index.html из alpine)
RUN rm -rf /* 2>/dev/null || true

# Копируем собранную статику из стадии build
COPY --from=build /app/dist ./

# Экспорт статики в volume
VOLUME ["/dist"]

# Команда, которая держит контейнер запущенным
CMD ["sh", "-c", "echo 'Frontend static files are ready in /dist'; sleep infinity"]