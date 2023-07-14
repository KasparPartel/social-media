package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	eh "social-network/packages/errorHandler"
	"social-network/packages/httpRouting"
	"social-network/packages/models"
	"social-network/packages/session"
	"social-network/packages/sqlite"
	"social-network/packages/utils"
	"social-network/packages/validator"
	websocketchat "social-network/packages/webSocketChat"
	"strconv"
	"strings"
)

// POST /groups
func CreateGroup(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	responseId := s.GetUID()
	group := models.CreateGroupRequest{}

	// get user info
	err = json.NewDecoder(r.Body).Decode(&group)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	group.Title = strings.TrimSpace(group.Title)
	group.Description = strings.TrimSpace(group.Description)

	v := validator.ValidationBuilder{}
	errArr := v.ValidateGroupInput(group.Title, group.Description).
		Validate()

	if len(errArr) > 0 {
		response.Errors = errArr
		json.NewEncoder(w).Encode(response)
		return
	}

	groupResponse, err := sqlite.CreateGroup(group, responseId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = groupResponse

	json.NewEncoder(w).Encode(response)
}

// GET /groups
func GetAllGroups(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestId := s.GetUID()

	groupsResponse, err := sqlite.GetAllGroups(requestId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = groupsResponse
	json.NewEncoder(w).Encode(response)
}

// GET /group/:id
func GetGroup(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()
	inputId, _ := httpRouting.GetField(r, "id")
	groupId, _ := strconv.Atoi(inputId)

	groupsResponse, err := sqlite.GetGroupById(groupId, requestUserId)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = groupsResponse
	json.NewEncoder(w).Encode(response)
}

// POST /group/:id/:action (actions: join, leave). Example: /group/12/join
func JoinLeaveGroup(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()
	inputId, _ := httpRouting.GetField(r, "id")
	action, _ := httpRouting.GetField(r, "action")
	groupId, _ := strconv.Atoi(inputId)

	isJoining := true

	switch action {
	case "join":
		isJoining = true
	case "leave":
		isJoining = false
	}

	joinStatus, err := sqlite.UpdateJoinStatus(groupId, requestUserId, isJoining)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.UpdateJoinStatus{JoinStatus: joinStatus}
	json.NewEncoder(w).Encode(response)
}

// GET /group/:groupId/invite
func InviteToGroup(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()
	inputId, _ := httpRouting.GetField(r, "id")
	groupId, _ := strconv.Atoi(inputId)

	invitedUsers := models.InviteToGroup{}

	err = json.NewDecoder(r.Body).Decode(&invitedUsers)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	v := validator.ValidationBuilder{}

	errs := v.ValidateUserExists(invitedUsers.Users...).Validate()
	if len(errs) != 0 {
		response.Errors = errs
		json.NewEncoder(w).Encode(response)
		return
	}

	users, err := sqlite.InviteToGroup(groupId, requestUserId, invitedUsers.Users)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.InviteToGroup{Users: users}
	json.NewEncoder(w).Encode(response)
}

// POST /group/:groupId/feed
func CreatePostEvent(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()
	inputId, _ := httpRouting.GetField(r, "id")
	groupId, _ := strconv.Atoi(inputId)

	group, err := sqlite.GetGroupById(groupId, requestUserId)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	} else if group.JoinStatus != 3 {
		response.Errors = []*eh.ErrorResponse{
			eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")}
		json.NewEncoder(w).Encode(response)
		return
	}

	post := models.CreatePostEventRequest{}
	err = json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	post.Text = strings.TrimSpace(post.Text)
	post.Title = strings.TrimSpace(post.Title)

	responsePost := &models.CreatePostEventResponse{}

	if post.IsEvent {
		responsePost, err = sqlite.CreateGroupEvent(groupId, requestUserId, post.Text, post.Title, post.DateTime)
	} else {
		responsePost, err = sqlite.CreateGroupPost(groupId, requestUserId, post.Text)
	}

	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if post.IsEvent {
		userIds, err := sqlite.GetAllGroupMembers(groupId)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		userIds = utils.FilterArray(userIds, func(a int) bool {
			return a != requestUserId
		})

		err = websocketchat.Connections.SendMessageToUsers(userIds, *responsePost)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	response.Data = responsePost
	json.NewEncoder(w).Encode(response)
}

// POST /group/:groupId/feed
func GetGroupFeed(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()
	inputId, _ := httpRouting.GetField(r, "id")
	groupId, _ := strconv.Atoi(inputId)

	group, err := sqlite.GetGroupById(groupId, requestUserId)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	} else if group.JoinStatus != 3 {
		response.Errors = []*eh.ErrorResponse{
			eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")}
		json.NewEncoder(w).Encode(response)
		return
	}

	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	posts, err := sqlite.GetAllPosts(groupId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	events, err := sqlite.GetAllEvents(groupId, requestUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response.Data = models.GetGroupFeedResponse{
		Posts:  posts,
		Events: events,
	}
	json.NewEncoder(w).Encode(response)
}

func AcceptJoinRequest(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ := httpRouting.GetField(r, "id")
	paramGroupId, _ := strconv.Atoi(inputId)

	requestUserId := s.GetUID()

	group, err := sqlite.GetGroupById(paramGroupId, requestUserId)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	} else if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if !group.IsOwner {
		response.Errors = []*eh.ErrorResponse{
			eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ = httpRouting.GetField(r, "userId")
	paramUserId, _ := strconv.Atoi(inputId)

	err = sqlite.AcceptJoinGroup(group.Id, paramUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func RejectJoinRequest(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ := httpRouting.GetField(r, "id")
	paramGroupId, _ := strconv.Atoi(inputId)

	requestUserId := s.GetUID()

	group, err := sqlite.GetGroupById(paramGroupId, requestUserId)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	} else if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if !group.IsOwner {
		response.Errors = []*eh.ErrorResponse{
			eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ = httpRouting.GetField(r, "userId")
	paramUserId, _ := strconv.Atoi(inputId)

	err = sqlite.RejectJoinGroup(group.Id, paramUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func AcceptInvitationRequest(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ := httpRouting.GetField(r, "id")
	paramGroupId, _ := strconv.Atoi(inputId)

	requestUserId := s.GetUID()

	err = sqlite.AcceptInvitationGroup(paramGroupId, requestUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func RejectInvitationRequest(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	w.Header().Set("Content-Type", "application/json")

	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		json.NewEncoder(w).Encode(response)
		return
	}

	inputId, _ := httpRouting.GetField(r, "id")
	paramGroupId, _ := strconv.Atoi(inputId)

	requestUserId := s.GetUID()

	err = sqlite.RejectInvitationGroup(paramGroupId, requestUserId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
