package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/utils"
)

// GET /user/:id/followers
func GetFollowers(w http.ResponseWriter, r *http.Request) {
	followerdIdArray := []int{12, 24, 11, 155}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(followerdIdArray)
}

// GET /user/:id/followings
func GetFollowings(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, errRes, err := utils.HasAccess(r)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if errRes != nil {
		response.Errors = []*errorHandler.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	followingsArr, err := sqlite.GetFollowings(u.Id)
	if err != nil && err != sql.ErrNoRows {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = followingsArr

	json.NewEncoder(w).Encode(response)
}

// PUT /user/:id/followers
func UpdateFollowers(w http.ResponseWriter, r *http.Request) {

}
