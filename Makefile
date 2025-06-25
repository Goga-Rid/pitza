# --- Docker цели ---

# запуск локальной разработки в Docker (Vite dev server)
docker-dev:
	docker build -f Dockerfile.dev -t pitza-dev .
	docker run --name pitza-dev --rm -it -p 5173:5173 -v $(PWD):/app pitza-dev

# сборка и запуск продакшена в Docker
docker-prod:
	docker build -f Dockerfile -t pitza-prod .
	docker run -d --name pitza -p 80:80 pitza-prod

docker-stop:
	docker stop pitza-dev

# --- NPM цели ---
install:
	npm ci

# локальная разработка (vite)
dev:
	npm run dev
# сборка
build:
	npm run build
# линтер
lint:
	npm run lint

lint-fix:
	npm run lint:fix

test-unit:
	npm run test

test-e2e:
	npm run mock:backend > /dev/null 2>&1 & sleep 5 && npm run dev & sleep 5 && npm run test:e2e:ci

clean-test-results:
	npm run clean:test-results

# для получения mock backend
mock-backend:
	npm run mock:backend