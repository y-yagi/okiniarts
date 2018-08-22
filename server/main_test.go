package main

import (
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
	"testing"
)

type auth struct {
	audience      string
	grant_type    string
	client_id     string
	client_secret string
}

func TestGetArts(t *testing.T) {
	addr := randomAddress(t)
	s := createServer()
	go func() {
		s.Start(addr.String())
	}()

	reqUrl := &url.URL{
		Scheme: "http",
		Host:   addr.String(),
		Path:   "/api/arts",
	}
	req, _ := http.NewRequest("GET", reqUrl.String(), nil)
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
