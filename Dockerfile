FROM node:12.16.3-alpine

WORKDIR /usr/src/app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn
COPY . .
RUN yarn build

CMD ["yarn", "start"]
