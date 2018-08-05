package main

import (
	"net/http"
	"os"
	"strconv"

	"github.com/go-pg/pg"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type Art struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

var db *pg.DB

func main() {
	initDB()
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/static", "public/static")
	e.File("/", "public/index.html")
	e.GET("/api/arts", arts)
	e.GET("/api/arts/:id", art)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}

func arts(c echo.Context) error {
	var arts []*Art
	arts = append(arts, &Art{Id: 1, Name: "海辺の船"})
	arts = append(arts, &Art{Id: 2, Name: "ルーアン大聖堂"})
	return c.JSON(http.StatusOK, arts)
}

func art(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	art := &Art{Id: id, Name: "海辺の船"}
	return c.JSON(http.StatusOK, art)
}
func initDB() {
	options, err := pg.ParseURL(os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	db = pg.Connect(options)
}
