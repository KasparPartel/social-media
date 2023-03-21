package utils

import (
	"database/sql"
	"net/http"
	"social-network/packages/db/sqlite"
	eh "social-network/packages/errorHandler"
	"social-network/packages/httpRouting"
	"social-network/packages/session"
	"strconv"
)

func HasAccess(r *http.Request) (*sqlite.User, int, error) {
	s, errRes := session.SessionProvider.GetSession(r)
	if errRes != nil {
		return nil, 0, errRes
	}

	inputId, _ := httpRouting.GetField(r, "id")

	requestedId, _ := strconv.Atoi(inputId)

	responseId := s.GetUID()

	u, err := sqlite.GetUserById(requestedId)
	if err == sql.ErrNoRows {
		return nil, 0, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}

	if err != nil {
		return nil, 0, err
	}

	if requestedId != responseId {
		u.FollowStatus, err = sqlite.GetFollowStatus(requestedId, responseId)
		if err != nil {
			return nil, 0, err
		}

		if !u.IsPublic && u.FollowStatus != 3 {
			return u, responseId, eh.NewErrorResponse(eh.ErrPrivateProfile, "profile is private")
		}
	}

	return u, responseId, nil
}

func IsOwn(r *http.Request) (int, error) {
	s, errRes := session.SessionProvider.GetSession(r)
	if errRes != nil {
		return 0, errRes
	}

	inputId, _ := httpRouting.GetField(r, "id")
	parsedId, _ := strconv.Atoi(inputId)
	id := s.GetUID()

	if parsedId != id {
		return 0, eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")
	}

	return id, nil
}
