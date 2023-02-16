package controllers

import (
	"encoding/json"
	"net/http"
)

type Post struct {
	ParentId       int    `json:"parentId"` // group id if created inside group
	Login          string `json:"login"`
	UserId         int    `json:"userId"`
	PostId         int    `json:"postId"`
	Title          string `json:"title"`
	Text           string `json:"text"`
	DateOfCreation int    `json:"dateOfCreation"`
	Visibility     string `json:"visibility"`
}

// GET /user/:id/posts
func GetPosts(w http.ResponseWriter, r *http.Request) {
	postIdArray := []int{12, 24, 11, 155}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postIdArray)
}

// POST /user/:id/posts
func CreatePost(w http.ResponseWriter, r *http.Request) {
	postIdArray := []int{12, 24, 11, 155}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postIdArray)
}

// GET /post/:id
func GetPost(w http.ResponseWriter, r *http.Request) {
	postInfo := &Post{
		ParentId:       34,
		Login:          "testUser",
		UserId:         28,
		PostId:         2003,
		Title:          "test title for post",
		Text:           "test text for post",
		DateOfCreation: 1672251842,
		Visibility:     "group",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postInfo)

}

// PUT /post/:id
func UpdatePost(w http.ResponseWriter, r *http.Request) {
	postInfo := &Post{
		ParentId:       34,
		Login:          "testUser",
		UserId:         28,
		PostId:         2003,
		Title:          "test title for post",
		Text:           "test text for post",
		DateOfCreation: 1672251842,
		Visibility:     "group",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postInfo)
}
