package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	eh "social-network/packages/errorHandler"
	"social-network/packages/httpRouting"
	"social-network/packages/models"
	"social-network/packages/session"
	"social-network/packages/sqlite"
	"social-network/packages/utils"
	"strconv"
)

// GET /user/:id/followers
func GetFollowers(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, _, err := utils.HasAccess(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
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
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, _, err := utils.HasAccess(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
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
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
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
		response.Errors = append(response.Errors, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request"))

		json.NewEncoder(w).Encode(response)
		return
	}

	response.Data = models.UpdateFollowersResponse{
		FollowStatus: followStatus,
	}

	json.NewEncoder(w).Encode(response)
}
