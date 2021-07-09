FROM node:12

WORKDIR /app

COPY . .

RUN npm i \
   && ./node_modules/.bin/fis3 release -cd ./public

EXPOSE 8888

CMD ["npm", "run", "serve"]

