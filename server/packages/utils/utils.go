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
	s, errRes := session.SessionProvider.GetSession(r)
	if errRes != nil {
		return nil, errRes, nil
	}

	inputId, _ := httpRouting.GetField(r, "id")

	parsedId, _ := strconv.Atoi(inputId)

	id := s.GetUID()

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

func IsOwn(r *http.Request) (int, *errorHandler.ErrorResponse, error) {
	s, errRes := session.SessionProvider.GetSession(r)
	if errRes != nil {
		return 0, errRes, nil
	}

	inputId, _ := httpRouting.GetField(r, "id")
	parsedId, _ := strconv.Atoi(inputId)
	id := s.GetUID()

	if parsedId != id {
		return 0, &errorHandler.ErrorResponse{
			Code:        errorHandler.ErrNoAccess,
			Description: "no access to this action",
		}, nil
	}

	return id, nil, nil
}
