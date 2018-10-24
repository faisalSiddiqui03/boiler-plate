FROM node:8-slim

ENV NPM_TOKEN 1c3d0f64-2c22-4a60-9fbd-35079f114183

RUN apt-get update && apt-get install -yq libgconf-2-4

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules

WORKDIR /usr/src/app/client

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

USER pptruser

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]

