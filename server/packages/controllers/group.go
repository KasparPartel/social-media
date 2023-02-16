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

// GET /user/:id/groups
func GetGroups(w http.ResponseWriter, r *http.Request) {
	groupIdArray := []int{88, 544}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(groupIdArray)
}

// POST /user/:id/groups
func CreateGroup(w http.ResponseWriter, r *http.Request) {

}

// GET /groups/
func GetAllGroups(w http.ResponseWriter, r *http.Request) {
	groupIdArray := []int{88, 544, 556, 13, 1}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(groupIdArray)
}

// GET /group/:id
func GetGroup(w http.ResponseWriter, r *http.Request) {
	testGroup := &Group{
		Id:          1,
		Title:       "test group",
		Description: "test description",
		Members:     []int{544, 54, 12},
		Requsts:     []int{13, 4},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(testGroup)
}

// PUT /group/:id
func UpdateGroup(w http.ResponseWriter, r *http.Request) {

}
