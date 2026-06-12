prepara-backend:
	docker run -it --rm -v .:/usr/src/app -w /usr/src/app node:lts-slim sh -c "npm i -g @nestjs/cli && nest new adotai --directory ./backend"

prepara-frontend:
	docker run --rm -it -v .:/usr/src/app -w /usr/src/app node:lts-slim npx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*"

up:
	docker compose up --build

down:
	docker compose down -v
