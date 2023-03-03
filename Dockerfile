FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn
ENV NODE_ENV production
RUN yarn build

CMD [ "node", "dist/main.js" ]
