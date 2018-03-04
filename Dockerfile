FROM node:9

RUN mkdir -p /usr/src/geckoboard-push
WORKDIR /usr/src/geckoboard-push

COPY ["package.json", "yarn.lock", "./"]

ENV NODE_ENV production

RUN cd /usr/src/geckoboard-push && yarn

COPY . .

CMD ["node", "src/index.js"]
