FROM node:18.16 AS builder

WORKDIR /client

COPY . .

RUN npm install && npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /client/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]