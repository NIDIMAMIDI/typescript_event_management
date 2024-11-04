FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm install -g typescript

CMD [ "node", "dist/app.js" ]