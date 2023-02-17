package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/models"
	"social-network/packages/utils"
)

// GET /user/:id
func GetUserInfo(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, errRes, err := utils.HasAccess(r)
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

	avatar, err := sqlite.GetAvatar(u.AvatarId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.GetUserResponse{
		Id:          u.Id,
		Avatar:      avatar,
		Email:       u.Email,
		Login:       u.Login,
		FirstName:   u.FirstName,
		LastName:    u.LastName,
		AboutMe:     u.AboutMe,
		DateOfBirth: u.DateOfBirth,
		IsPublic:    u.IsPublic,
	}

	json.NewEncoder(w).Encode(response)
}
