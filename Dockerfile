FROM node:12.4-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src /app/src

RUN npm install 
RUN npm run build

EXPOSE 3000
# COPY . .
CMD [ "node", "./dist/app.js" ]