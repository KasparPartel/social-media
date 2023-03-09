package errorHandler

import (
	"log"
	"os"
)

const (
	ErrEmailFormat = iota + 1
	ErrPasswordTooShort
	ErrPasswordTooLong
	ErrPasswordFormat
	ErrLoginTooShort
	ErrLoginTooLong
	ErrLoginFormat
	ErrFirstNameFormat
	ErrLastNameFormat
	ErrUniqueEmail
	ErrUniqueLogin
	ErrIncorrectCred
	ErrSessionExpired
	ErrSessionNotExist
	ErrPrivateProfile
	ErrNotFound
	ErrNoAccess
)

type Response struct {
	Data   any              `json:"data"`
	Errors []*ErrorResponse `json:"errors"`
}

type ErrorResponse struct {
	Code        uint   `json:"code"`
	Description string `json:"description"`
}

func LogErrorFatal(err error, messages ...any) {
	if err != nil {
		log.Println(err.Error())
		for _, v := range messages {
			log.Println(v)
		}
		os.Exit(1)
	}
}
