FROM node:18.16 AS builder

WORKDIR /client

COPY . .

RUN npm install && npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf ./*

COPY --from=builder /client/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]