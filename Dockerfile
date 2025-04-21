FROM node:22 AS base
WORKDIR /app

RUN npm install -g pnpm tsc

COPY pnpm-lock.yaml ./

RUN pnpm fetch

ADD . ./
RUN pnpm install -r --offline