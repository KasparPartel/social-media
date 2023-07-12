package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/packages/db/sqlite"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"social-network/packages/session"
)

func GetAllNotifications(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()

	allNotifications := models.GetAllNotificationsResponse{}

	allNotifications.FollowRequest, err = sqlite.GetAllFollowers(requestUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	allNotifications.InviteRequest, err = sqlite.GetAllInvitationByUserId(requestUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	allNotifications.JoinRequest, err = sqlite.GetAllJoinRequests(requestUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = allNotifications
	json.NewEncoder(w).Encode(allNotifications)
}
