package main

import (
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

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

func arts(c echo.Context) error {
	var arts []Art
	if err := db.Model(&arts).Relation("Artist").Where("art.user_identifier = ?", extractUserID(c)).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, arts)
}

func art(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	art := &Art{Id: id}
	if err := db.Model(art).Relation("Artist").Where("art.user_identifier = ? AND art.id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, art)
}

func getArtists(c echo.Context) error {
	var artists []Artist
	if err := db.Model(&artists).Where("user_identifier = ?", extractUserID(c)).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, artists)
}

func createArtist(c echo.Context) error {
	a := &Artist{
		UserIdentifier: extractUserID(c),
	}
	if err := c.Bind(a); err != nil {
		return err
	}

	err := db.Insert(a)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, a)
}

func getArtist(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	a := &Artist{Id: id}
	if err := db.Model(a).Where("user_identifier = ? AND id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, a)
}

func updateArtist(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	a := &Artist{Id: id}
	if err := db.Model(a).Where("user_identifier = ? AND id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	if err := c.Bind(a); err != nil {
		return err
	}

	err := db.Update(a)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, a)
}

func deleteArtist(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	a := &Artist{Id: id}
	if err := db.Model(a).Where("user_identifier = ? AND id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	db.Delete(a)
	return c.NoContent(http.StatusNoContent)
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

func extractUserID(c echo.Context) string {
	token := c.Get("user").(*jwt.Token)
	claims, _ := token.Claims.(jwt.MapClaims)
	return claims["sub"].(string)
}
