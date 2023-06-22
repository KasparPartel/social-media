package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	eh "social-network/packages/errorHandler"
	"social-network/packages/httpRouting"
	"social-network/packages/models"
	"social-network/packages/session"
	"social-network/packages/validator"
	"strconv"
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
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestId := s.GetUID()

	groupsResponse, err := sqlite.GetAllGroups(requestId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = groupsResponse
	json.NewEncoder(w).Encode(response)
}

// GET /group/:id
func GetGroup(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()
	inputId, _ := httpRouting.GetField(r, "id")
	groupId, _ := strconv.Atoi(inputId)

	groupsResponse, err := sqlite.GetGroup(requestUserId, groupId)
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

	response.Data = groupsResponse
	json.NewEncoder(w).Encode(response)
}

// PUT /group/:id
func UpdateGroup(w http.ResponseWriter, r *http.Request) {

}

// GET /group/:groupId/invite
func InviteToGroup(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()
	inputId, _ := httpRouting.GetField(r, "id")
	groupId, _ := strconv.Atoi(inputId)

	invitedUsers := models.InviteToGroup{}

	err = json.NewDecoder(r.Body).Decode(&invitedUsers)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	users, err := sqlite.InviteToGroup(groupId, requestUserId, invitedUsers.Users)
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

	response.Data = models.InviteToGroup{Users: users}
	json.NewEncoder(w).Encode(response)
}
