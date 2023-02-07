package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/router"
	"strconv"
)

// GET /user/:id
func GetProfile(w http.ResponseWriter, r *http.Request) {
	inputId := router.GetField(r, "id")

	id, _ := strconv.Atoi(inputId)

	fmt.Println(id) // todo

	// get porfile info if public

	login := "foobar"
	aboutMe := "test about me"
	testUser := &sqlite.User{
		Email:       "example@example.com",
		FirstName:   "John",
		LastName:    "Doe",
		DateOfBirth: 1672248421,
		Login:       &login,
		AboutMe:     &aboutMe,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(testUser)

}
