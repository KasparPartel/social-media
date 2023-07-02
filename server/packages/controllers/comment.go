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

// GET post/:id/comments/
func GetComments(w http.ResponseWriter, r *http.Request) {
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

	requestId := s.GetUID()

	post, err := sqlite.GetPostById(postId, requestId)
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

	if post.GroupId != 0 {
		group, err := sqlite.GetGroupById(post.GroupId, requestId)
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
	}

	commentsId, err := sqlite.GetCommentsByPostId(post.Id)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = commentsId

	json.NewEncoder(w).Encode(response)
}

// POST post/:id/comments/
func CreateComment(w http.ResponseWriter, r *http.Request) {
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
	requestId := s.GetUID()

	comment := models.CreateCommentRequest{}

	// get user info
	err = json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	post, err := sqlite.GetPostById(postId, requestId)
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

	if post.GroupId != 0 {
		group, err := sqlite.GetGroupById(post.GroupId, requestId)
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
	}

	comment.Text = strings.TrimSpace(comment.Text)

	v := validator.ValidationBuilder{}
	errRes := v.
		ValidatePostInput(comment.Text, comment.Attachments).
		ValidateImages(comment.Attachments...).
		Validate()

	if len(errRes) > 0 {
		response.Errors = errRes
		json.NewEncoder(w).Encode(response)
		return
	}

	commentResult, err := sqlite.CreateComment(post.Id, requestId, comment)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response.Data = commentResult

	json.NewEncoder(w).Encode(response)
}

// GET comment/:id
func GetComment(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ := httpRouting.GetField(r, "id")
	commentId, _ := strconv.Atoi(inputId)

	requestId := s.GetUID()

	comment, err := sqlite.GetCommentById(commentId, requestId)
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

	response.Data = comment

	json.NewEncoder(w).Encode(response)
}
