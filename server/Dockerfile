FROM golang:1.19-alpine AS builder

WORKDIR /server

COPY . .

RUN apk update && apk add --no-cache gcc musl-dev

RUN go build -o social-network .

FROM alpine:latest 

WORKDIR /server

COPY --from=builder /server/social-network .

COPY --from=builder /server/db/migrations ./db/migrations

EXPOSE 8080

CMD ["./social-network"]