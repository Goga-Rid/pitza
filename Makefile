install:
	npm ci
lint:
	npx eslint .
fix:
	npx eslint . --fix
dev:
	npx vite --host 0.0.0.0
build:
	npx tsc -b && npx vite build
preview:
	npx vite preview
clean:
	rm -rf dist/