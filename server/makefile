GOCMD=go
GOBUILD=$(GOCMD) build
GOTEST=$(GOCMD) test
GOCLEAN=$(GOCMD) clean
BINARY_NAME=server

export PUBKEY=testdata/jwtRS256.key.pub
export DATABASE_URL=postgres://okiniarts:okiniarts@172.24.0.1:5434/okiniarts_test?sslmode=disable

all: test build
build:
	$(GOBUILD) -o $(BINARY_NAME) -v
test:
	$(GOTEST) -v
clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
