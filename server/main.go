package main

import (
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type ArtWork struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
}

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", hello)
	e.GET("/api/artworks", artworks)
	e.GET("/api/artworks/:id", artwork)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}

func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

func artworks(c echo.Context) error {
	var artworks []*ArtWork
	artworks = append(artworks, &ArtWork{Id: 1, Title: "海辺の船"})
	artworks = append(artworks, &ArtWork{Id: 2, Title: "ルーアン大聖堂"})
	return c.JSON(http.StatusOK, artworks)
}

func artwork(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	artwork := &ArtWork{Id: id, Title: "海辺の船"}
	return c.JSON(http.StatusOK, artwork)
}
