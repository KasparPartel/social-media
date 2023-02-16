package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/session"
	"social-network/packages/validator"
	"strconv"

	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

// /register
//
// POST -> (email, login, password, firstName, lastName, dateOfBirth) --->>>
//
// --->>> (data: {id, email, login, firstName, lastName, dateOfBirth}, errors: [code, description])
func RegistrationHandler(w http.ResponseWriter, r *http.Request) {
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
	var parsedUser sqlite.User

	// get user info
	err := json.NewDecoder(r.Body).Decode(&parsedUser)
	if err != nil {
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
		log.Printf("register functions error: %v", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// remove private data
	parsedUser.UUID = ""
	parsedUser.Password = ""

	parsedUser.Id = id

	response.Data = parsedUser
	json.NewEncoder(w).Encode(response)
}

// /login
//
//	POST -> (login, password) --->>>
//
// --->>> (data: {id, avatarId, email, login, firstName, lastName, aboutMe dateOfBirth, isPublic}, errors: [code, description])
func LoginHandler(w http.ResponseWriter, r *http.Request) {
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

	var parsedUser sqlite.User
	response := &errorHandler.Response{}

	// get user info
	err := json.NewDecoder(r.Body).Decode(&parsedUser)
	if err != nil {
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
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token := session.SessionProvider.SessionAdd(u.UUID)
	session.SessionProvider.SetToken(token, w)

	u.Password = ""
	u.UUID = ""

	response.Data = u
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

	if err != nil && err != http.ErrNoCookie {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	session.SessionProvider.SessionRemove(token)
	session.SessionProvider.RemoveToken(w)
}

// parse all trafic on /user/ endpoint tp different functions
func UserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token")
	if r.Method == "OPTIONS" {
		return
	}

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
