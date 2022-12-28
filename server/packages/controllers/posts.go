package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
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

// GET POST /user/:id/posts
func GetPostsHandler(w http.ResponseWriter, r *http.Request, id int) {
	if r.Method != "POST" && r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get list of posts id
	if r.Method == "GET" {
		postIdArray := []int{12, 24, 11, 155}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(postIdArray)
		return
	}

	if r.Method == "POST" {
		// create post
	}
}

// /post/...
func PostHandler(w http.ResponseWriter, r *http.Request) {
	reg := regexp.MustCompile(`/post/(?:(?P<id>[0-9]{1,16})(?:/(?P<path>[a-z]{1,32}))?)?`)
	match := reg.FindStringSubmatch(r.URL.Path)

	id := match[1]
	path := match[2]

	if id == "" {
		fmt.Println("must provide id")
		return
	}

	parsedId, err := strconv.Atoi(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	switch path {
	case "":
		PostManage(w, r, parsedId)
	case "comments":
		GetCommentsHandler(w, r, parsedId)
	default:
		w.WriteHeader(http.StatusNotFound)
	}
}

// GET PUT DELETE /post/:id
func PostManage(w http.ResponseWriter, r *http.Request, id int) {
	if r.Method != "GET" && r.Method != "DELETE" && r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get post info
	if r.Method == "GET" {
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
		return
	}

	if r.Method == "PUT" {
		// update post info
	}

	if r.Method == "DELETE" {
		// delete post
	}
}
