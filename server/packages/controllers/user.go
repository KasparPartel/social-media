package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/models"
	"social-network/packages/session"
	"social-network/packages/validator"

	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

// /register
//
// POST -> (email, password, firstName, lastName, dateOfBirth) --->>>
//
// --->>> (data: {id, email, firstName, lastName, dateOfBirth}, errors: [code, description])
func RegistrationHandler(w http.ResponseWriter, r *http.Request) {
	var parsedUser sqlite.User

	// get user info
	err := json.NewDecoder(r.Body).Decode(&parsedUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	response := &errorHandler.Response{}
	w.Header().Set("Content-Type", "application/json")
	errs := validator.ValidateRegister(parsedUser.Email, parsedUser.Password, parsedUser.FirstName, parsedUser.LastName, parsedUser.Login)
	// return all format errors
	if len(errs) > 0 {
		response.Errors = errs
		json.NewEncoder(w).Encode(response)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(parsedUser.Password), 10)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	parsedUser.UUID = uuid.NewV4().String()
	parsedUser.Password = string(hashedPassword)

	id, err := sqlite.CreateUser(parsedUser)
	if !validator.IsUnique("email", err) {
		response.Errors = []*errorHandler.ErrorResponse{{
			Code:        errorHandler.ErrUniqueEmail,
			Description: "email is already taken",
		}}
		json.NewEncoder(w).Encode(response)
		return
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.GetUserResponse{
		Id:          id,
		Email:       parsedUser.Email,
		Login:       parsedUser.Login,
		FirstName:   parsedUser.FirstName,
		LastName:    parsedUser.LastName,
		AboutMe:     parsedUser.AboutMe,
		DateOfBirth: parsedUser.DateOfBirth,
		IsPublic:    parsedUser.IsPublic,
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
	response := &errorHandler.Response{}

	// get user info
	err := json.NewDecoder(r.Body).Decode(&parsedUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if len(parsedUser.Password) < 1 {
		response.Errors = []*errorHandler.ErrorResponse{{
			Code:        errorHandler.ErrIncorrectCred,
			Description: "incorrect login or password",
		}}
		json.NewEncoder(w).Encode(response)
		return
	}

	u, err := sqlite.AuthorizeUser(parsedUser)

	if err == bcrypt.ErrMismatchedHashAndPassword || err == sql.ErrNoRows {
		response.Errors = []*errorHandler.ErrorResponse{{
			Code:        errorHandler.ErrIncorrectCred,
			Description: "incorrect login or password",
		}}
		json.NewEncoder(w).Encode(response)
		return
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token := session.SessionProvider.SessionAdd(u.UUID)
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
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token")
	if r.Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	token, err := session.SessionProvider.GetToken(r)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	session.SessionProvider.SessionRemove(token)
	session.SessionProvider.RemoveToken(w)
}
