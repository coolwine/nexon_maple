FROM node:20

WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

ENV PORT=3000
EXPOSE ${PORT}

CMD ["yarn", "start:prod"]
