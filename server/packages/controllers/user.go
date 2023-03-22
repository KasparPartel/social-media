package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"social-network/packages/session"
	"social-network/packages/validator"

	"golang.org/x/crypto/bcrypt"
)

// /register
//
// POST -> (email, password, firstName, lastName, dateOfBirth) --->>>
//
// --->>> (data: {id, email, firstName, lastName, dateOfBirth}, errors: [code, description])
func RegistrationHandler(w http.ResponseWriter, r *http.Request) {
	var u sqlite.User

	// get user info
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	v := validator.ValidationBuilder{}

	errs := v.ValidateEmail(u.Email).
		ValidatePassword(u.Password).
		ValidateFirstName(u.FirstName).
		ValidateLastName(u.LastName).
		Validate()

	// return all format errors
	if len(errs) > 0 {
		response.Errors = errs
		json.NewEncoder(w).Encode(response)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), 10)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	u.Password = string(hashedPassword)

	id, err := sqlite.CreateUser(u)
	errs = v.ValidateIsUnique("email", err).Validate()
	if len(errs) > 0 {
		response.Errors = errs
		json.NewEncoder(w).Encode(response)
		return
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token := session.SessionProvider.AddSession(id)
	session.SessionProvider.SetToken(token, w)

	response.Data = models.GetUserResponse{
		Id:          id,
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

// /login
//
//	POST -> (login, password) --->>>
//
// --->>> (data: {id, avatar, email, login, firstName, lastName, aboutMe dateOfBirth, isPublic}, errors: [code, description])
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var parsedUser sqlite.User
	response := &eh.Response{}

	// get user info
	err := json.NewDecoder(r.Body).Decode(&parsedUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if len(parsedUser.Password) < 1 {
		response.Errors = append(response.Errors, eh.NewErrorResponse(eh.ErrIncorrectCred, "incorrect login or password"))
		json.NewEncoder(w).Encode(response)
		return
	}

	u, err := sqlite.AuthorizeUser(parsedUser)

	if err == bcrypt.ErrMismatchedHashAndPassword || err == sql.ErrNoRows {
		response.Errors = append(response.Errors, eh.NewErrorResponse(eh.ErrIncorrectCred, "incorrect login or password"))
		json.NewEncoder(w).Encode(response)
		return
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token := session.SessionProvider.AddSession(u.Id)
	session.SessionProvider.SetToken(token, w)

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

// /logout
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	s, err := session.SessionProvider.GetSession(r)
	if err != nil {
		return
	}

	s.SessionRemove()
	session.SessionProvider.RemoveToken(w)
}
