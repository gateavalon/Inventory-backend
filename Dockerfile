FROM node:16-alpine

WORKDIR /api

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 8000

CMD [ "yarn", "dev" ]