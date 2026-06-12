FROM node:lts-slim AS base
WORKDIR /usr/src/app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci

FROM dependencies AS dev
COPY . .
EXPOSE 8000

CMD ["npm", "run", "start:dev"]