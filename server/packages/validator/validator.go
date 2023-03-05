package validator

import (
	"regexp"
	eh "social-network/packages/errorHandler"
	"strings"
)

type ValidationBuilder struct {
	errs []*eh.ErrorResponse
}

func (v *ValidationBuilder) ValidateEmail(email string) *ValidationBuilder {
	r := regexp.MustCompile(`^[A-Za-z0-9~\x60!#$%^&*()_\-+={\[}\]|\\:;"'<,>.?/]{1,64}@[a-z]{1,255}\.[a-z]{1,63}$`)

	a := r.MatchString(email)
	if !a {
		v.errs = append(v.errs, &eh.ErrorResponse{
			Code:        eh.ErrEmailFormat,
			Description: "invalid email format",
		})
	}

	return v
}

func (v *ValidationBuilder) ValidatePassword(password string) *ValidationBuilder {
	length := len(password)
	if length < 8 {
		v.errs = append(v.errs, &eh.ErrorResponse{
			Code:        eh.ErrPasswordTooShort,
			Description: "password length must be longer than 8 characters",
		})
	} else if length > 32 {
		v.errs = append(v.errs, &eh.ErrorResponse{
			Code:        eh.ErrPasswordTooLong,
			Description: "password length must be shorter than 32 characters",
		})
	} else {
		r := regexp.MustCompile(`^[A-Za-z0-9~\x60!@#$%^&*()_\-+={\[}\]|\\:;"'<,>.?/]{8,32}$`)
		a := r.MatchString(password)
		if !a {
			v.errs = append(v.errs, &eh.ErrorResponse{
				Code:        eh.ErrPasswordFormat,
				Description: "password contains restricted symbols",
			})
		}
	}

	return v
}

func (v *ValidationBuilder) ValidateLogin(login string) *ValidationBuilder {
	length := len(login)
	if length < 4 {
		v.errs = append(v.errs, &eh.ErrorResponse{
			Code:        eh.ErrLoginTooShort,
			Description: "login length must be longer than 4 characters",
		})
	} else if length > 24 {
		v.errs = append(v.errs, &eh.ErrorResponse{
			Code:        eh.ErrLoginTooLong,
			Description: "login length must be shorter than 24 characters",
		})
	} else {
		r := regexp.MustCompile(`^[A-Za-z0-9_]{4,24}$`)
		a := r.MatchString(login)
		if !a {
			v.errs = append(v.errs, &eh.ErrorResponse{
				Code:        eh.ErrLoginFormat,
				Description: "login contains restricted symbols",
			})
		}
	}

	return v
}

func (v *ValidationBuilder) ValidateFirstName(name string) *ValidationBuilder {
	r := regexp.MustCompile(`^[A-Za-z]{1,}$`)

	a := r.MatchString(name)
	if !a {
		v.errs = append(v.errs, &eh.ErrorResponse{
			Code:        eh.ErrFirstNameFormat,
			Description: "invalid first name format",
		})
	}

	return v
}

func (v *ValidationBuilder) ValidateLastName(name string) *ValidationBuilder {
	r := regexp.MustCompile(`^[A-Za-z]{1,}$`)

	a := r.MatchString(name)
	if !a {
		v.errs = append(v.errs, &eh.ErrorResponse{
			Code:        eh.ErrLastNameFormat,
			Description: "invalid last name format",
		})
	}

	return nil
}

func (v ValidationBuilder) Validate() []*eh.ErrorResponse {
	return v.errs
}

func IsUnique(tableName string, err error) bool {
	if err != nil && strings.Contains(err.Error(), "UNIQUE") && strings.Contains(err.Error(), tableName) {
		return false
	}

	return true
}
