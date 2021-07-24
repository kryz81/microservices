FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm i

COPY ./ ./

ENV POSTS_URL posts-srv-clusterip
ENV COMMENTS_URL comments-srv
ENV QUERY_URL query-srv
ENV MODERATION_URL moderation-srv

CMD ["npm", "start"]
