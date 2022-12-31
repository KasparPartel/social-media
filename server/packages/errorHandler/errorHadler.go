package errorHandler

import (
	"log"
	"os"
)

const (
	ErrEmailFormat     = 1
	ErrPasswordLow     = 2
	ErrPasswordBig     = 3
	ErrPasswordFormat  = 4
	ErrLoginLow        = 5
	ErrLoginHigh       = 6
	ErrLoginFormat     = 7
	ErrFirstNameFormat = 8
	ErrLastNameFormat  = 9
	ErrUniqueEmail     = 10
	ErrUniqueLogin     = 11
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
