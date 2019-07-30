package main

import (
	"os"

	"github.com/go-pg/pg"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

// Art is type for art data
type Art struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Detail         string `json:"detail"`
	ArtistID       int    `json:"artist_id"`
	UserIdentifier string `json:"-"`
	Artist         Artist `json:"artist"`
}

// Artist is type for artist data
type Artist struct {
	ID             int    `json:"id"`
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
	e.File("/callback", "public/index.html")
	e.File("/manifest.json", "public/manifest.json")
	addRoutes(e)
	e.File("/*", "public/index.html")

	return e
}

func initDB() {
	options, err := pg.ParseURL(os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	db = pg.Connect(options)
}
