FROM node:16.2.0-buster as install

RUN apt-get update

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

ARG version=dev
ENV VERSION=$version

FROM install as build

COPY . .

RUN yarn build

FROM node:16.2.0-buster as production-build

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./

COPY --from=build /usr/src/app/dist /usr/src/app/dist

RUN yarn install --frozen-lockfile --production && yarn cache clean

CMD node dist/src/core/index.js

EXPOSE 3000
