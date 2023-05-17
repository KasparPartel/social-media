package errorHandler

import (
	"fmt"
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
	ErrNotUnique
	_
	ErrIncorrectCred
	ErrSessionExpired
	ErrSessionNotExist
	ErrPrivateProfile
	ErrNotFound
	ErrNoAccess
	ErrWrongPrivacy
	ErrEmptyInput
	ErrImageFormat
	ErrWrongUserId
)

type Response struct {
	Data   any              `json:"data"`
	Errors []*ErrorResponse `json:"errors"`
}

type ErrorResponse struct {
	Code        uint   `json:"code"`
	Description string `json:"description"`
}

func NewErrorResponse(code uint, desctiption string) *ErrorResponse {
	return &ErrorResponse{
		Code:        code,
		Description: desctiption,
	}
}

func (er *ErrorResponse) Error() string {
	return fmt.Sprintf("%T, code: %d, description: %s", er, er.Code, er.Description)
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
