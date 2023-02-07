package controllers

import (
	"encoding/json"
	"net/http"
)

// GET /user/:id/followers
func GetFollowers(w http.ResponseWriter, r *http.Request) {
	followerdIdArray := []int{12, 24, 11, 155}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(followerdIdArray)
}

// PUT /user/:id/followers
func UpdateFollowers(w http.ResponseWriter, r *http.Request) {

}
