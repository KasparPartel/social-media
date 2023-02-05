package validator

import (
	"regexp"
	eh "social-network/packages/errorHandler"
	"strings"
)

func ValidateEmail(email string) *eh.ErrorResponse {
	r := regexp.MustCompile(`^[A-Za-z0-9~\x60!#$%^&*()_\-+={\[}\]|\\:;"'<,>.?/]{1,64}@[a-z]{1,255}\.[a-z]{1,63}$`)

	a := r.MatchString(email)
	if !a {
		return &eh.ErrorResponse{
			Code:        eh.ErrEmailFormat,
			Description: "invalid email format",
		}
	}

	return nil
}

func ValidatePassword(password string) *eh.ErrorResponse {
	length := len(password)
	if length < 8 {
		return &eh.ErrorResponse{
			Code:        eh.ErrPasswordTooShort,
			Description: "password length must be longer than 8 characters",
		}
	}

	if length > 32 {
		return &eh.ErrorResponse{
			Code:        eh.ErrPasswordTooLong,
			Description: "password length must be shorter than 32 characters",
		}
	}

	r := regexp.MustCompile(`^[A-Za-z0-9~\x60!@#$%^&*()_\-+={\[}\]|\\:;"'<,>.?/]{8,32}$`)
	a := r.MatchString(password)
	if !a {
		return &eh.ErrorResponse{
			Code:        eh.ErrPasswordFormat,
			Description: "password contains restricted symbols",
		}
	}

	return nil
}

func ValidateLogin(login string) *eh.ErrorResponse {
	length := len(login)
	if length < 4 {
		return &eh.ErrorResponse{
			Code:        eh.ErrLoginTooShort,
			Description: "login length must be longer than 4 characters",
		}
	}

	if length > 24 {
		return &eh.ErrorResponse{
			Code:        eh.ErrLoginTooLong,
			Description: "login length must be shorter than 24 characters",
		}
	}

	r := regexp.MustCompile(`^[A-Za-z0-9_.]{4,24}$`)
	a := r.MatchString(login)
	if !a {
		return &eh.ErrorResponse{
			Code:        eh.ErrLoginFormat,
			Description: "login contains restricted symbols",
		}
	}

	return nil
}

func ValidateFirstName(name string) *eh.ErrorResponse {
	r := regexp.MustCompile(`^[A-Za-z]{1,}$`)

	a := r.MatchString(name)
	if !a {
		return &eh.ErrorResponse{
			Code:        eh.ErrFirstNameFormat,
			Description: "invalid first name format",
		}
	}

	return nil
}

func ValidateLastName(name string) *eh.ErrorResponse {
	r := regexp.MustCompile(`^[A-Za-z]{1,}$`)

	a := r.MatchString(name)
	if !a {
		return &eh.ErrorResponse{
			Code:        eh.ErrLastNameFormat,
			Description: "invalid last name format",
		}
	}

	return nil
}

func ValidateRegister(email, password, firstName, lastName string, login *string) []*eh.ErrorResponse {
	res := make([]*eh.ErrorResponse, 0)

	err := ValidateEmail(email)
	appendError(&res, err)

	err = ValidatePassword(password)
	appendError(&res, err)

	err = ValidateFirstName(firstName)
	appendError(&res, err)

	err = ValidateLastName(lastName)
	appendError(&res, err)

	return res
}

func appendError(arr *[]*eh.ErrorResponse, err *eh.ErrorResponse) {
	if err != nil {
		*arr = append(*arr, err)
	}
}

func IsUnique(tableName string, err error) bool {
	if err != nil && strings.Contains(err.Error(), "UNIQUE") && strings.Contains(err.Error(), tableName) {
		return false
	}

	return true
}
