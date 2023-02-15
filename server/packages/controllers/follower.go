package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/router"
	"social-network/packages/session"
	"strconv"
)

// GET /user/:id/followers
func GetFollowers(w http.ResponseWriter, r *http.Request) {
	followerdIdArray := []int{12, 24, 11, 155}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(followerdIdArray)
}

// GET /user/:id/followings
func GetFollowings(w http.ResponseWriter, r *http.Request) {
	token, err := session.SessionProvider.GetToken(r)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, errs := session.SessionProvider.SessionGet(token)
	if errs != nil {
		response.Errors = []*errorHandler.ErrorResponse{errs}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId := router.GetField(r, "id")

	parsedId, _ := strconv.Atoi(inputId)
	u, err := sqlite.GetUserById(parsedId)
	if err == sql.ErrNoRows {
		response.Errors = []*errorHandler.ErrorResponse{{
			Code:        errorHandler.ErrNotFound,
			Description: "wrong variable(s) in request",
		}}
		json.NewEncoder(w).Encode(response)
		return
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	id, err := sqlite.GetId(s.GetUUID())
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if parsedId != id {
		followed, err := sqlite.IsFollower(parsedId, id)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if !u.IsPublic && !followed {
			response.Errors = []*errorHandler.ErrorResponse{{
				Code:        errorHandler.ErrPrivateProfile,
				Description: "profile is private",
			}}
			json.NewEncoder(w).Encode(response)
			return
		}
	}

	followingsArr, err := sqlite.GetFollowings(parsedId)
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
