FROM node:10

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade

# Install latest chrome dev package.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable --no-install-recommends

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Download latest Lighthouse from npm.
# cache bust so we always get the latest version of LH when building the image.
ARG CACHEBUST=1

RUN mkdir -p /lighthouse
WORKDIR /lighthouse

COPY config /lighthouse/config
COPY server /lighthouse/server

COPY webpack.config.js /lighthouse/webpack.config.js
COPY package.json /lighthouse/package.json
COPY package-lock.json /lighthouse/package-lock.json

RUN npm install && npm run build


RUN groupadd -r chrome && useradd -r -m -g chrome -G audio,video chrome && \
    chown -R chrome:chrome /lighthouse/public

USER chrome

VOLUME /lighthouse/public

CMD ["npm", "start"]