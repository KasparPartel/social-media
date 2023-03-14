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
)

// GET /user/:id
func GetUserInfo(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, _, errRes, err := utils.HasAccess(r)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if errRes != nil && errRes.Code != errorHandler.ErrPrivateProfile {
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

	temp := models.GetUserResponse{
		Id:           u.Id,
		Avatar:       avatar,
		FirstName:    u.FirstName,
		LastName:     u.LastName,
		FollowStatus: u.FollowStatus,
		IsPublic:     u.IsPublic,
	}

	if u.IsPublic {
		temp.Email = u.Email
		temp.Login = u.Login
		temp.AboutMe = u.AboutMe
		temp.DateOfBirth = u.DateOfBirth
	}

	response.Data = temp

	json.NewEncoder(w).Encode(response)
}

var WHITE_LIST = [...]string{"login", "aboutMe", "isPublic"}

// PUT /user/:id
func UpdateUserInfo(w http.ResponseWriter, r *http.Request) {
	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")

	fields := make(map[string]string)

	// get user info
	err := json.NewDecoder(r.Body).Decode(&fields)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	id, errRes, err := utils.IsOwn(r)
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

	if avatar, e := fields["avatar"]; e {
		err = sqlite.UpdateAvatar(avatar, id)

		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	if login, e := fields["login"]; e {
		v := validator.ValidationBuilder{}

		errArr := v.ValidateLogin(login).Validate()
		if len(errArr) > 0 {
			response.Errors = errArr
			json.NewEncoder(w).Encode(response)
			return
		}
	}

	for _, tableName := range WHITE_LIST {
		if value, e := fields[tableName]; e {
			err = sqlite.UpdateProfileColumn(tableName, value, id)

			if err != nil {
				log.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}
	}
}
