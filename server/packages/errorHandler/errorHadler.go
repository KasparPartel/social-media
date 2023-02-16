package errorHandler

import (
	"log"
	"os"
)

const (
	ErrEmailFormat      = 1
	ErrPasswordTooShort = 2
	ErrPasswordTooLong  = 3
	ErrPasswordFormat   = 4
	ErrLoginTooShort    = 5
	ErrLoginTooLong     = 6
	ErrLoginFormat      = 7
	ErrFirstNameFormat  = 8
	ErrLastNameFormat   = 9
	ErrUniqueEmail      = 10
	ErrUniqueLogin      = 11
	ErrIncorrectCred    = 12
	ErrSessionExpired   = 13
	ErrSessionNotExist  = 14
	ErrPrivateProfile   = 15
	ErrNotFound         = 16
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
