package main

import (
	"io/ioutil"
	"os"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-pg/pg"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type Art struct {
	Id             int    `json:"id"`
	Name           string `json:"name"`
	Detail         string `json:"detail"`
	ArtistID       int    `json:"artist_id"`
	UserIdentifier string `json:"-"`
	Artist         Artist `json:"artist"`
}

type Artist struct {
	Id             int    `json:"id"`
	Name           string `json:"name"`
	Detail         string `json:"detail"`
	UserIdentifier string `json:"-"`
	Arts           []*Art `json:"arts"`
}

var db *pg.DB

func main() {
	initDB()
	e := createServer()

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}

func createServer() *echo.Echo {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/static", "public/static")
	e.File("/", "public/index.html")

	r := e.Group("/api")
	config := middleware.JWTConfig{
		SigningMethod: "RS256",
		SigningKey:    auth0Key(),
	}
	r.Use(middleware.JWTWithConfig(config))
	r.GET("/arts", arts)
	r.GET("/arts/:id", art)
	r.GET("/artists", getArtists)
	r.POST("/artists", createArtist)
	r.GET("/artists/:id", getArtist)
	r.PUT("/artists/:id", updateArtist)
	r.DELETE("/artists/:id", deleteArtist)

	return e
}

func initDB() {
	options, err := pg.ParseURL(os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	db = pg.Connect(options)
}

func auth0Key() interface{} {
	pem, _ := ioutil.ReadFile("auth0_pubkey")
	key, _ := jwt.ParseRSAPublicKeyFromPEM(pem)
	return key
}
