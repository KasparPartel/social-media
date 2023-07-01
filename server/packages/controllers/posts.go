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
	"social-network/packages/utils"
	"social-network/packages/validator"
	"strconv"
	"strings"
)

// GET /user/:id/posts
func GetPosts(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, followerId, err := utils.HasAccess(r)
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

	postIds, err := sqlite.GetUserPosts(u, followerId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = postIds

	json.NewEncoder(w).Encode(response)
}

// POST /user/:id/posts
func CreatePost(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	post := models.CreatePostRequest{}

	// get user info
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	userId, err := utils.IsOwn(r)
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

	post.Text = strings.TrimSpace(post.Text)

	v := validator.ValidationBuilder{}
	errArr := v.
		ValidatePostInput(post.Text, post.Attachments).
		ValidateImages(post.Attachments...).
		ValidateUserExists(post.AuthorizedFollowers...).
		ValidateHaveInvalidOption(post.Privacy, []int{1, 2, 3}).
		Validate()

	if len(errArr) > 0 {
		response.Errors = errArr
		json.NewEncoder(w).Encode(response)
		return
	}

	postId, creationDate, err := sqlite.CreateUserPost(userId, post)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.GetPostResponse{
		Id:           postId,
		UserId:       userId,
		Text:         post.Text,
		Attachments:  post.Attachments,
		CreationDate: creationDate,
	}

	json.NewEncoder(w).Encode(response)
}

// GET /post/:id
func GetPost(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ := httpRouting.GetField(r, "id")

	postId, _ := strconv.Atoi(inputId)
	responseId := s.GetUID()

	post, err := sqlite.GetPostById(postId, responseId)
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

	response.Data = post

	json.NewEncoder(w).Encode(response)
}

// POST /event/:eventId/action
func SelectEventAction(w http.ResponseWriter, r *http.Request) {
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
	eventId, _ := strconv.Atoi(inputId)

	isGoingStatus := models.ChangeEventAction{}
	err = json.NewDecoder(r.Body).Decode(&isGoingStatus)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	v := validator.ValidationBuilder{}

	errRes := v.
		ValidateHaveInvalidOption(isGoingStatus.IsGoing, []int{1, 2, 3}).
		Validate()
	if len(errRes) > 0 {
		response.Errors = errRes
		json.NewEncoder(w).Encode(response)
		return
	}

	event, err := sqlite.GetEventById(eventId, requestUserId)
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

	group, err := sqlite.GetGroupById(event.GroupId, requestUserId)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	} else if group.JoinStatus != 3 {
		response.Errors = []*eh.ErrorResponse{
			eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")}
		json.NewEncoder(w).Encode(response)
		return
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if *event.IsGoing == 1 && isGoingStatus.IsGoing != 1 {
		isGoingStatus.IsGoing, err = sqlite.AddEventStatus(event.Id, event.UserId, isGoingStatus.IsGoing)
	} else if isGoingStatus.IsGoing == 1 && *event.IsGoing != 1 {
		isGoingStatus.IsGoing, err = sqlite.DeleteEventStatus(event.Id, event.UserId, isGoingStatus.IsGoing)
	} else if isGoingStatus.IsGoing != *event.IsGoing {
		isGoingStatus.IsGoing, err = sqlite.UpdateEventStatus(event.Id, event.UserId, isGoingStatus.IsGoing)
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.ChangeEventAction{IsGoing: isGoingStatus.IsGoing}
	json.NewEncoder(w).Encode(response)
}
