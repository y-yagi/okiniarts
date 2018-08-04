FROM golang:1.10

RUN curl -fsSL -o /usr/local/bin/dep https://github.com/golang/dep/releases/download/v0.5.0/dep-linux-amd64 && chmod +x /usr/local/bin/dep

RUN mkdir -p /go/src/github.com/y-yagi/artworks
WORKDIR /go/src/github.com/y-yagi/artworks

COPY Gopkg.toml Gopkg.lock ./

RUN dep ensure -vendor-only

COPY main.go /go/src/github.com/y-yagi/artworks
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix nocgo -o /server .
