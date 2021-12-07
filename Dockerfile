FROM node:latest
WORKDIR /home/node/app
COPY www/package.json .
RUN npm install
COPY . .

EXPOSE 1883