package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/models"
	"social-network/packages/utils"
	"social-network/packages/validator"
	"strings"
	"time"
)

// GET /user/:id/posts
func GetPosts(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, followerId, errRes, err := utils.HasAccess(r)
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
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	post := models.CreatePostRequest{}

	// get user info
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	userId, errRes, err := utils.IsOwn(r)
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

	post.Text = strings.TrimSpace(post.Text)

	v := validator.ValidationBuilder{}
	errArr := v.
		ValidatePostInput(post.Text, post.Attachments).
		ValidateImages(post.Attachments...).
		ValidateUserExists(post.AuthorizedFollowers...).
		ValidatePrivacyOption(post.Privacy).
		Validate()

	if len(errArr) > 0 {
		response.Errors = errArr
		json.NewEncoder(w).Encode(response)
		return
	}

	postId, err := sqlite.CreateUserPost(userId, post)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.GetPostResponse{
		Id:                  postId,
		UserId:              userId,
		Text:                post.Text,
		Attachments:         post.Attachments,
		AuthorizedFollowers: post.AuthorizedFollowers,
		Comments:            []int{},
		CreationDate:        int(time.Now().UnixMicro()),
	}

	json.NewEncoder(w).Encode(response)
}

// GET /post/:id
func GetPost(w http.ResponseWriter, r *http.Request) {
	postInfo := &models.CreatePostRequest{
		Text:    "test text for post",
		Privacy: 1,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postInfo)
}

// PUT /post/:id
func UpdatePost(w http.ResponseWriter, r *http.Request) {
	postInfo := &models.CreatePostRequest{
		Text:    "test text for post",
		Privacy: 1,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postInfo)
}
