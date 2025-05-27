# pitza
Pitza 🍕✨ - Объединяем дух Петербурга и любовь к пицце!  Проект для пицца-энтузиастов из Санкт-Петербурга (и не только).

# Pitza Frontend

## Быстрый старт

### Локальная разработка
```sh
make docker-dev
# или
# docker-compose up frontend-dev (предварительно раскомментируй сервис в docker-compose.yml)
```

### Сборка и запуск продакшена
```sh
make docker-prod
# или
make compose-up
# или
# docker-compose up --build -d
```

### Публикация образа в Docker Hub
1. Войти в Docker Hub:
   ```sh
   docker login
   ```
2. Собрать и тегировать образ:
   ```sh
   docker build -t <your_dockerhub_username>/pitza:latest .
   ```
3. Отправить образ в Docker Hub:
   ```sh
   docker push <your_dockerhub_username>/pitza:latest
   ```

### Тесты и линтинг
```sh
make lint
make test
```

### CI/CD
- Автоматическая публикация образа и деплой на сервер через GitHub Actions (см. .github/workflows/ci.yml).

### Деплой через CI/CD
- Всё происходит автоматически после push в main (см. .github/workflows/ci.yml).
- Для ручного деплоя:
```sh
ssh user@server
cd /path/to/project
git pull
docker-compose pull
docker-compose up -d
```

### Мониторинг
- Prometheus: http://<ip_сервера>:9090
- Grafana: http://<ip_сервера>:3000 (admin/admin)

### Безопасность
- Все секреты — только в переменных окружения/секретах CI.
- Минимальные права для сервисных пользователей.
- Firewall, fail2ban, регулярные обновления.

---

## Структура
- Dockerfile — продакшен
- Dockerfile.dev — разработка
- docker-compose.yml — сервисы
- Makefile — удобные команды
- ansible/ — автоматизация сервера
- monitoring/ — мониторинг
- nginx/ — конфиги nginx
- .github/workflows/ci.yml — CI/CD pipeline

---

## Контакты
DevOps: <твой email/telegram>
