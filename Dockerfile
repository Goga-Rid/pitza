#сборка фронта
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

#финальный образ — только статика
FROM alpine:latest
WORKDIR /app
COPY --from=build /app/dist /app/dist 