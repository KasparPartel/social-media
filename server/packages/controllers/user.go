package controllers

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
)

// /login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

// /register
func RegistrationHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

// /logout
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

// parse all trafic on /user/ endpoint tp different functions
func UserHandler(w http.ResponseWriter, r *http.Request) {
	reg := regexp.MustCompile(`/user/(?:(?P<id>[0-9]{1,16})(?:/(?P<path>[a-z]{1,32}))?)?`)
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
		ProfileHandler(w, r, parsedId)
	case "followers":
		FollowersHandler(w, r, parsedId)
	case "groups":
		GetUserGroupsHandler(w, r, parsedId)
	case "posts":
		GetPostsHandler(w, r, parsedId)
	case "chats":
		GetChatsHandler(w, r, parsedId)
	default:
		w.WriteHeader(http.StatusNotFound)
	}
}
