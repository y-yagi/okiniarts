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
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Detail string `json:"detail"`
}

var db *pg.DB

func main() {
	initDB()
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

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}

func arts(c echo.Context) error {
	var arts []Art
	if err := db.Model(&arts).Where("user_identifier = ?", extractUserID(c)).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, arts)
}

func art(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	art := &Art{Id: id}
	if err := db.Model(art).Where("user_identifier = ? AND id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, art)
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
