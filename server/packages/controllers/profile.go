package controllers

import (
	"encoding/json"
	"net/http"
	"social-network/packages/db/sqlite"
)

// /user/:id
func ProfileHandler(w http.ResponseWriter, r *http.Request, id int) {
	if r.Method != "PUT" && r.Method != "GET" && r.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get porfile info if public
	if r.Method == "GET" {
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
		return
	}

	if r.Method == "PUT" {
		// update profile info if autorized
	}

	if r.Method == "DELETE" {
		// delete porfile info if autorized
	}
}
