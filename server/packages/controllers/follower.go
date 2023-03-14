package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/httpRouting"
	"social-network/packages/models"
	"social-network/packages/session"
	"social-network/packages/utils"
	"strconv"
)

// GET /user/:id/followers
func GetFollowers(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, _, errRes, err := utils.HasAccess(r)
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

	followersArr, err := sqlite.GetUserFollowers(u.Id)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = followersArr

	json.NewEncoder(w).Encode(response)
}

// GET /user/:id/followings
func GetFollowings(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, _, errRes, err := utils.HasAccess(r)
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

	followingsArr, err := sqlite.GetUserFollowings(u.Id)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = followingsArr

	json.NewEncoder(w).Encode(response)
}

// PUT /user/:id/followers
func UpdateFollowers(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, sessionErr := session.SessionProvider.GetSession(r)
	if sessionErr != nil {
		response.Errors = []*errorHandler.ErrorResponse{sessionErr}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ := httpRouting.GetField(r, "id") // id from url
	parsedId, _ := strconv.Atoi(inputId)

	id := s.GetUID() // id of user who requested

	// same user
	if id == parsedId {
		return
	}

	followStatus, err := sqlite.ChangeFollow(parsedId, id)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if followStatus == 0 {
		response.Errors = append(response.Errors, &errorHandler.ErrorResponse{
			Code:        errorHandler.ErrNotFound,
			Description: "wrong variable(s) in request",
		})
		json.NewEncoder(w).Encode(response)
		return
	}

	response.Data = models.UpdateFollowersResponse{
		FollowStatus: followStatus,
	}

	json.NewEncoder(w).Encode(response)
}
