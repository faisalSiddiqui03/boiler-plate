FROM node:8

ENV NPM_TOKEN 1c3d0f64-2c22-4a60-9fbd-35079f114183

RUN npm set unsafe-perm true

WORKDIR /usr/src/app/client

COPY ./client/scripts ./scripts
COPY ./client/package*.json ./
COPY ./client/.npmrc ./

RUN npm install

WORKDIR /usr/src/app/server

COPY ./server/package*.json ./
COPY ./server/.npmrc ./

RUN npm install

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npm run build:prod

WORKDIR /usr/src/app/dist

EXPOSE 3000

CMD ["node", "app.js"]


