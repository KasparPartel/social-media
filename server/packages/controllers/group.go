package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"social-network/packages/session"
	"social-network/packages/validator"
	"strings"
)

// GET /user/:id/groups
func GetGroups(w http.ResponseWriter, r *http.Request) {
	groupIdArray := []int{88, 544}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(groupIdArray)
}

// POST /groups
func CreateGroup(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	responseId := s.GetUID()
	group := models.CreateGroupRequest{}

	// get user info
	err = json.NewDecoder(r.Body).Decode(&group)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	group.Title = strings.TrimSpace(group.Title)
	group.Description = strings.TrimSpace(group.Description)

	v := validator.ValidationBuilder{}
	errArr := v.ValidateGroupInput(group.Title, group.Description).
		Validate()

	if len(errArr) > 0 {
		response.Errors = errArr
		json.NewEncoder(w).Encode(response)
		return
	}

	groupResponse, err := sqlite.CreateGroup(group, responseId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = groupResponse

	json.NewEncoder(w).Encode(response)
}

// GET /groups
func GetAllGroups(w http.ResponseWriter, r *http.Request) {
	groupIdArray := []int{88, 544, 556, 13, 1}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(groupIdArray)
}

// GET /group/:id
func GetGroup(w http.ResponseWriter, r *http.Request) {

}

// PUT /group/:id
func UpdateGroup(w http.ResponseWriter, r *http.Request) {

}
