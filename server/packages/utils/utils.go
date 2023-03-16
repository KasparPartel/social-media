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

func HasAccess(r *http.Request) (*sqlite.User, int, *errorHandler.ErrorResponse, error) {
	s, errRes := session.SessionProvider.GetSession(r)
	if errRes != nil {
		return nil, 0, errRes, nil
	}

	inputId, _ := httpRouting.GetField(r, "id")

	requestedId, _ := strconv.Atoi(inputId)

	responseId := s.GetUID()

	u, err := sqlite.GetUserById(requestedId)
	if err == sql.ErrNoRows {
		return nil, 0, &errorHandler.ErrorResponse{
			Code:        errorHandler.ErrNotFound,
			Description: "wrong variable(s) in request",
		}, nil
	}

	if err != nil {
		return nil, 0, nil, err
	}

	if requestedId != responseId {
		u.FollowStatus, err = sqlite.GetFollowStatus(requestedId, responseId)
		if err != nil {
			return nil, 0, nil, err
		}

		if !u.IsPublic && u.FollowStatus != 3 {
			return nil, responseId, &errorHandler.ErrorResponse{
				Code:        errorHandler.ErrPrivateProfile,
				Description: "profile is private",
			}, nil
		}
	}

	return u, responseId, nil, nil
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
