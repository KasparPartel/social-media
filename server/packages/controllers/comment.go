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

// GET POST post/:id/comments/
func GetCommentsHandler(w http.ResponseWriter, r *http.Request, id int) {
	if r.Method != "GET" && r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get list of comments id
	if r.Method == "GET" {
		commentsArray := []int{56, 666, 23, 45, 66}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(commentsArray)
		return
	}

	if r.Method == "POST" {
		// create new comment
	}
}

// GET comment/:id
func GetCommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get comment info
	if r.Method == "GET" {
		commentInfo := &Comment{
			ParentId:       43,
			UserId:         14,
			Login:          "mensunn",
			Text:           "test comment",
			DateOfCreation: 1672251842,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(commentInfo)
		return
	}
}
