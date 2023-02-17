package utils

import (
	"database/sql"
	"net/http"
	"social-network/packages/db/sqlite"
	"social-network/packages/errorHandler"
	"social-network/packages/httpRouting"
	"social-network/packages/session"
	"strconv"
)

func HasAccess(r *http.Request) (*sqlite.User, *errorHandler.ErrorResponse, error) {
	token, err := session.SessionProvider.GetToken(r)
	if err != nil {
		return nil, nil, err
	}

	s, errs := session.SessionProvider.SessionGet(token)
	if errs != nil {
		return nil, errs, nil
	}

	inputId, _ := httpRouting.GetField(r, "id")

	parsedId, _ := strconv.Atoi(inputId)
	u, err := sqlite.GetUserById(parsedId)
	if err == sql.ErrNoRows {
		return nil, &errorHandler.ErrorResponse{
			Code:        errorHandler.ErrNotFound,
			Description: "wrong variable(s) in request",
		}, nil
	}
	if err != nil {
		return nil, nil, err
	}

	id, err := sqlite.GetId(s.GetUUID())
	if err != nil {
		return nil, nil, err
	}

	if parsedId != id {
		followed, err := sqlite.IsFollower(parsedId, id)
		if err != nil {
			return nil, nil, err
		}

		if !u.IsPublic && !followed {
			return nil, &errorHandler.ErrorResponse{
				Code:        errorHandler.ErrPrivateProfile,
				Description: "profile is private",
			}, nil
		}
	}

	return u, nil, nil
}
