package controllers

import (
	"encoding/json"
	"net/http"
)

// GET PUT DELETE /user/:id/followers
func FollowersHandler(w http.ResponseWriter, r *http.Request, id int) {
	if r.Method != "PUT" && r.Method != "GET" && r.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get id list of followers if autorized ??? or not id but all users info
	if r.Method == "GET" {
		followerdIdArray := []int{12, 24, 11, 155}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(followerdIdArray)
		return
	}

	if r.Method == "PUT" {
		// update list of followers if autorized
	}

	if r.Method == "DELETE" {
		// delete follower from list of followers if autorized
	}
}
