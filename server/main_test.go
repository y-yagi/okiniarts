package main

import (
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
	"testing"
)

type auth struct {
	audience     string
	grantType    string
	clientID     string
	clientSecret string
}

func TestGetArts(t *testing.T) {
	addr := randomAddress(t)
	s := createServer()
	go func() {
		s.Start(addr.String())
	}()

	reqURL := &url.URL{
		Scheme: "http",
		Host:   addr.String(),
		Path:   "/api/arts",
	}
	req, _ := http.NewRequest("GET", reqURL.String(), nil)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}

	actual := string(body)
	expected := `{"message":"missing or malformed jwt"}`
	if actual != expected {
		t.Errorf("got: %s\nwont: %s", actual, expected)
	}
}

func randomAddress(t *testing.T) net.Addr {
	t.Helper()

	listener, err := net.Listen("tcp", ":0")
	listener.Close()

	if err != nil {
		t.Fatal(err)
	}
	return listener.Addr()
}
