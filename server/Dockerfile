FROM golang:1.13

RUN mkdir -p /go/src/github.com/y-yagi/okiniarts
WORKDIR /go/src/github.com/y-yagi/okiniarts

COPY go.mod go.sum ./

RUN GO111MODULE=on go mod download

COPY main.go /go/src/github.com/y-yagi/okiniarts
COPY handlers.go /go/src/github.com/y-yagi/okiniarts
RUN GO111MODULE=on CGO_ENABLED=0 GOOS=linux go build -a -installsuffix nocgo -o /server .
