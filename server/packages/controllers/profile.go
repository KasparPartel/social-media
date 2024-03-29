package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"social-network/packages/sqlite"
	"social-network/packages/utils"
	"social-network/packages/validator"
)

// GET /user/:id
func GetUserInfo(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	u, followerId, err := utils.HasAccess(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok && errRes.Code != eh.ErrPrivateProfile {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	if _, ok := err.(*eh.ErrorResponse); !ok && err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
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

	if u.IsPublic || u.Id == followerId {
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
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	fields := make(map[string]string)

	// get user info
	err := json.NewDecoder(r.Body).Decode(&fields)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	id, err := utils.IsOwn(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	parsedField := make(map[string]string)
	if avatar, e := fields["avatar"]; e {
		err = sqlite.UpdateAvatar(avatar, id)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		parsedField["avatar"] = avatar
	}

	v := validator.ValidationBuilder{}
	if login, e := fields["login"]; e {
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

			errArr := v.ValidateIsUnique("login", err).Validate()
			if len(errArr) > 0 {
				response.Errors = errArr
				json.NewEncoder(w).Encode(response)
				return
			}

			if err != nil {
				log.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			parsedField[tableName] = value
		}
	}

	response.Data = parsedField
	json.NewEncoder(w).Encode(response)
}
