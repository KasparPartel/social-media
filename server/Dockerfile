FROM golang:1.19-alpine

RUN apk update && apk add --no-cache gcc musl-dev

COPY . /server

WORKDIR /server

RUN go get ./...

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]