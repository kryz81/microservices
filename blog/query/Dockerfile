FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm i

COPY ./ ./

ENV EVENTS_URL event-bus-srv

CMD ["npm", "start"]
