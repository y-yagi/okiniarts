package main

import (
	"encoding/json"
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

func generateTestData() {
	db.ExecOne("TRUNCATE TABLE artists")
	db.ExecOne("TRUNCATE TABLE arts")

	a := &Artist{
		UserIdentifier: "1",
		Name:           "クロード・モネ",
		Detail:         "印象派を代表するフランスの画家",
	}
	if err := db.Insert(a); err != nil {
		panic(err)
	}

	art := &Art{
		UserIdentifier: "1",
		Name:           "積みわら",
		Detail:         "収穫後の畑に積まれた干し草の山を描いた一連の絵画の総称",
		ArtistID:       a.ID,
	}
	if err := db.Insert(art); err != nil {
		panic(err)
	}
}

func TestMain(m *testing.M) {
	initDB()
	defer db.Close()
	generateTestData()

	code := m.Run()

	defer os.Exit(code)
}

func TestGetArts(t *testing.T) {
	addr := startServer(t)

	reqURL := &url.URL{
		Scheme: "http",
		Host:   addr.String(),
		Path:   "/api/arts",
	}

	req, _ := http.NewRequest("GET", reqURL.String(), nil)
	req.Header.Add("Authorization", "Bearer "+generateToken(t))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}

	var arts []Art
	json.Unmarshal([]byte(string(body)), &arts)

	expected := "積みわら"
	actual := arts[0].Name
	if actual != expected {
		t.Errorf("got: %s\nwont: %s", actual, expected)
	}

	expected = "収穫後の畑に積まれた干し草の山を描いた一連の絵画の総称"
	actual = arts[0].Detail
	if actual != expected {
		t.Errorf("got: %s\nwont: %s", actual, expected)
	}
}

func startServer(t *testing.T) net.Addr {
	addr := randomAddress(t)
	s := createServer()
	go func() {
		s.Start(addr.String())
	}()

	return addr
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

func generateToken(t *testing.T) string {
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Minute * 60).Unix(),
		Subject:   "1",
	}

	keyData, _ := ioutil.ReadFile("testdata/jwtRS256.key")
	key, err := jwt.ParseRSAPrivateKeyFromPEM(keyData)
	if err != nil {
		t.Fatal(err)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	ss, err := token.SignedString(key)
	if err != nil {
		t.Fatal(err)
	}
	return ss
}
