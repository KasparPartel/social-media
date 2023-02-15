package controllers

import (
	"encoding/json"
	"net/http"
)

type Comment struct {
	ParentId       int    `json:"parentId"`
	UserId         int    `json:"userId"`
	Login          string `json:"login"`
	Text           string `json:"text"`
	DateOfCreation int    `json:"dateOfCreation"`
}

// GET post/:id/comments/
func GetComments(w http.ResponseWriter, r *http.Request) {
	commentsArray := []int{56, 666, 23, 45, 66}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(commentsArray)
}

// POST post/:id/comments/
func CreateComment(w http.ResponseWriter, r *http.Request) {

}

// GET comment/:id
func GetComment(w http.ResponseWriter, r *http.Request) {
	commentInfo := &Comment{
		ParentId:       43,
		UserId:         14,
		Login:          "mensunn",
		Text:           "test comment",
		DateOfCreation: 1672251842,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(commentInfo)
}
