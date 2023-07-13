FROM node:16.20

COPY . /client

WORKDIR /client

COPY package*.json /client/

RUN npm install -g serve

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]