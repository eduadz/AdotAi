FROM node:lts-slim AS base
WORKDIR /usr/src/app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci

FROM dependencies AS dev
COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev"]