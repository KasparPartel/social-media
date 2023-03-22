package validator

import (
	"regexp"
	"social-network/packages/db/sqlite"
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
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrEmailFormat, "invalid email format"))
	}

	return v
}

func (v *ValidationBuilder) ValidatePassword(password string) *ValidationBuilder {
	length := len(password)
	if length < 8 {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrPasswordTooShort, "password length must be longer than 8 characters"))
	} else if length > 32 {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrPasswordTooLong, "password length must be shorter than 32 characters"))
	} else {
		r := regexp.MustCompile(`^[A-Za-z0-9~\x60!@#$%^&*()_\-+={\[}\]|\\:;"'<,>.?/]{8,32}$`)
		a := r.MatchString(password)
		if !a {
			v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrPasswordFormat, "password contains restricted symbols"))
		}
	}

	return v
}

func (v *ValidationBuilder) ValidateLogin(login string) *ValidationBuilder {
	length := len(login)
	if length < 4 {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrLoginTooShort, "login length must be longer than 4 characters"))
	} else if length > 24 {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrLoginTooLong, "login length must be shorter than 24 characters"))
	} else {
		r := regexp.MustCompile(`^[A-Za-z0-9_]{4,24}$`)
		a := r.MatchString(login)
		if !a {
			v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrLoginFormat, "login contains restricted symbols"))
		}
	}

	return v
}

func (v *ValidationBuilder) ValidateFirstName(name string) *ValidationBuilder {
	r := regexp.MustCompile(`^[A-Za-z]{1,}$`)

	a := r.MatchString(name)
	if !a {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrFirstNameFormat, "invalid first name format"))
	}

	return v
}

func (v *ValidationBuilder) ValidateLastName(name string) *ValidationBuilder {
	r := regexp.MustCompile(`^[A-Za-z]{1,}$`)

	a := r.MatchString(name)
	if !a {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrLastNameFormat, "invalid last name format"))
	}

	return v
}

func (v *ValidationBuilder) ValidatePrivacyOption(privacy int) *ValidationBuilder {
	if privacy != 1 && privacy != 2 && privacy != 3 {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrWrongPrivacy, "wrong privacy setting"))
	}

	return v
}

func (v *ValidationBuilder) ValidatePostInput(text string, attachments []string) *ValidationBuilder {
	if len(attachments) == 0 && text == "" {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrEmptyInput, "no input provided"))
	}

	return v
}

func (v *ValidationBuilder) ValidateImages(attachments ...string) *ValidationBuilder {
	reg := regexp.MustCompile(`^data:image\/(?P<type>jpeg|gif|png);base64,(?P<value>[\S]+)$`)
	for _, image := range attachments {
		match := reg.MatchString(strings.TrimSpace(image))

		if !match {
			v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrImageFormat, "wrong image filetype/format"))
			return v
		}
	}

	return v
}

func (v *ValidationBuilder) ValidateUserExists(userIds ...int) *ValidationBuilder {
	for _, id := range userIds {
		u, _ := sqlite.GetUserById(id)
		if u == nil {
			v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrWrongUserId, "wrong user id provided"))
			return v
		}
	}
	return v
}

func (v *ValidationBuilder) IsUnique(tableName string, err error) *ValidationBuilder {
	if err != nil && strings.Contains(err.Error(), "UNIQUE") && strings.Contains(err.Error(), tableName) {
		v.errs = append(v.errs, eh.NewErrorResponse(eh.ErrUniqueEmail, tableName+" is already taken"))
	}

	return v
}

func (v ValidationBuilder) Validate() []*eh.ErrorResponse {
	return v.errs
}
