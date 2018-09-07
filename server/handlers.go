package main

import (
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func addRoutes(e *echo.Echo) {
	r := e.Group("/api")
	config := middleware.JWTConfig{
		SigningMethod: "RS256",
		SigningKey:    auth0Key(),
	}
	r.Use(middleware.JWTWithConfig(config))
	r.GET("/arts", getArts)
	r.GET("/arts/:id", getArt)
	r.POST("/arts", createArt)
	r.PUT("/arts/:id", updateArt)
	r.DELETE("/arts/:id", deleteArt)

	r.GET("/artists", getArtists)
	r.GET("/artists/:id", getArtist)
	r.POST("/artists", createArtist)
	r.PUT("/artists/:id", updateArtist)
	r.DELETE("/artists/:id", deleteArtist)
}

func getArts(c echo.Context) error {
	var arts []Art
	if err := db.Model(&arts).Relation("Artist").Where("art.user_identifier = ?", extractUserID(c)).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, arts)
}

func getArt(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	art := &Art{ID: id}
	if err := db.Model(art).Relation("Artist").Where("art.user_identifier = ? AND art.id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, art)
}

func createArt(c echo.Context) error {
	a := &Art{
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

func updateArt(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	a := new(Art)
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

func deleteArt(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	a := new(Art)
	if err := db.Model(a).Where("user_identifier = ? AND id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	db.Delete(a)
	return c.NoContent(http.StatusNoContent)
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
	a := new(Artist)
	if err := db.Model(a).Relation("Arts").Where("user_identifier = ? AND id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, a)
}

func updateArtist(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	a := new(Artist)
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
	a := new(Artist)
	if err := db.Model(a).Where("user_identifier = ? AND id = ?", extractUserID(c), id).Select(); err != nil {
		return err
	}

	db.Delete(a)
	return c.NoContent(http.StatusNoContent)
}

func auth0Key() interface{} {
	pem := []byte(os.Getenv("AUTH0_PUBKEY"))

	if len(pem) == 0 {
		pem, _ = ioutil.ReadFile("auth0_pubkey")
	}

	key, _ := jwt.ParseRSAPublicKeyFromPEM(pem)
	return key
}

func extractUserID(c echo.Context) string {
	token := c.Get("user").(*jwt.Token)
	claims, _ := token.Claims.(jwt.MapClaims)
	return claims["sub"].(string)
}
