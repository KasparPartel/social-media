package controllers

import (
	"encoding/json"
	"net/http"
)

type Group struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Members     []int  `json:"members"`
	Requsts     []int  `json:"requsts"` // id of users who requested to group
}

// GET POST /user/:id/groups
func GetUserGroupsHandler(w http.ResponseWriter, r *http.Request, id int) {
	if r.Method != "GET" && r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get user list of group id
	if r.Method == "GET" {
		groupIdArray := []int{88, 544}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(groupIdArray)
		return
	}

	if r.Method == "POST" {
		// create group
	}
}

// GET POST /groups/
func GetGroupsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get list of group id
	if r.Method == "GET" {
		groupIdArray := []int{88, 544, 556, 13, 1}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(groupIdArray)
		return
	}

	if r.Method == "POST" {
		// create group
	}
}

// GET PUT DELETE /group/:id
func GroupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "DELETE" && r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get group info
	if r.Method == "GET" {
		testGroup := &Group{
			Id:          1,
			Title:       "test group",
			Description: "test description",
			Members:     []int{544, 54, 12},
			Requsts:     []int{13, 4},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(testGroup)
		return
	}

	if r.Method == "PUT" {
		// update group info
	}

	if r.Method == "DELETE" {
		// delete group
	}
}
