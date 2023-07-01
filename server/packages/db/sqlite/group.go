package sqlite

import (
	"database/sql"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"time"
)

func CreateGroup(group models.CreateGroupRequest, userId int) (*models.CreateGroupResponse, error) {
	sqlStmt, err := db.Prepare(`INSERT INTO groups (userId, title, description, creationDate)
	VALUES (?, ?, ?, ?);`)
	if err != nil {
		return nil, err
	}

	creationDate := time.Now().UnixMilli()

	result, err := sqlStmt.Exec(userId, group.Title, group.Description, creationDate)
	if err != nil {
		return nil, err
	}

	groupId, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &models.CreateGroupResponse{
		Id:           int(groupId),
		Title:        group.Title,
		Description:  group.Description,
		CreationDate: int(creationDate),
		UserId:       userId,
	}, nil
}

func GetAllGroups(userId int) ([]models.GetGroupInfoResponse, error) {
	groups := make([]models.GetGroupInfoResponse, 0)

	rows, err := db.Query(`
	SELECT id,
		title,
		userId,
		(
			SELECT isAccepted
			FROM group_members
			WHERE id = group_members.groupId
				AND group_members.userId = ?
		),
		(
			SELECT 1
			FROM group_invitation
			WHERE id = group_invitation.groupId
				AND group_invitation.userId = ?
		)
	FROM groups`, userId, userId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		tempGroup := models.GetGroupInfoResponse{JoinStatus: 1}
		ownerId := 0
		var isAccepted *int
		var isInvited *int

		err = rows.Scan(&tempGroup.Id, &tempGroup.Title, &ownerId, &isAccepted, &isInvited)
		if err != nil {
			return nil, err
		}

		switch {
		case ownerId == userId || (isAccepted != nil && *isAccepted == 1):
			tempGroup.JoinStatus = 3
		case isAccepted != nil && *isAccepted == 0:
			tempGroup.JoinStatus = 2
		case isInvited != nil:
			tempGroup.JoinStatus = 4
		default:
			tempGroup.JoinStatus = 1
		}

		tempGroup.IsOwner = ownerId == userId

		groups = append(groups, tempGroup)
	}

	return groups, nil
}

func GetGroupById(groupId, userId int) (*models.GetGroupResponse, error) {
	group := &models.GetGroupResponse{JoinStatus: 1}
	ownerId := 0
	var isAccepted *int
	var isInvited *int

	err := db.QueryRow(`
	SELECT id,
		title,
		description,
		userId,
		(
			SELECT isAccepted
			FROM group_members
			WHERE id = group_members.groupId
				AND group_members.userId = ?
		),
		(
			SELECT 1
			FROM group_invitation
			WHERE id = group_invitation.groupId
				AND group_invitation.userId = ?
		)
	FROM groups
	WHERE id = ?`, userId, userId, groupId).Scan(&group.Id, &group.Title, &group.Description, &ownerId, &isAccepted, &isInvited)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	if err == sql.ErrNoRows {
		return nil, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}

	switch {
	case ownerId == userId || (isAccepted != nil && *isAccepted == 1):
		group.JoinStatus = 3
	case isAccepted != nil && *isAccepted == 0:
		group.JoinStatus = 2
	case isInvited != nil:
		group.JoinStatus = 4
	default:
		group.JoinStatus = 1
	}

	group.IsOwner = ownerId == userId

	return group, nil
}

func InviteToGroup(groupId, userId int, invitedUsers []int) ([]int, error) {
	sqlStmt, err := db.Prepare(`INSERT INTO group_invitation (groupId, userId)
	VALUES (?, ?);`)
	if err != nil {
		return nil, err
	}

	group, err := GetGroupById(groupId, userId)
	if err != nil {
		return nil, err
	}

	if group.JoinStatus != 3 {
		return nil, eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")
	}

	temp := make([]int, 0)

	for _, id := range invitedUsers {
		group, err = GetGroupById(groupId, id)
		if group.JoinStatus != 1 {
			continue
		}

		if err != nil {
			return nil, err
		}

		_, err = sqlStmt.Exec(groupId, id)
		if err != nil {
			return nil, err
		}

		temp = append(temp, id)
	}

	return temp, nil
}

func UpdateJoinStatus(groupId, userId int, isJoining bool) (int, error) {
	group, err := GetGroupById(groupId, userId)
	if err != nil {
		return 0, err
	}

	if group.JoinStatus != 1 && isJoining {
		return group.JoinStatus, nil
	} else if group.JoinStatus == 1 && !isJoining {
		return 1, nil
	}

	var sqlStmt *sql.Stmt
	if isJoining {
		sqlStmt, err = db.Prepare("INSERT INTO group_members (groupId, userId) VALUES (?, ?)")
	} else {
		sqlStmt, err = db.Prepare("DELETE FROM group_members WHERE groupId = ? AND userId = ?")
	}
	if err != nil {
		return 0, err
	}

	_, err = sqlStmt.Exec(groupId, userId)
	if err != nil {
		return 0, err
	}

	if isJoining {
		return 2, nil
	} else {
		return 1, nil
	}
}

func CreateGroupEvent(groupId, userId int, text, title string, datetime int) (*models.CreatePostEventResponse, error) {
	if text == "" || title == "" {
		return nil, eh.NewErrorResponse(eh.ErrEmptyInput, "no input provided")
	}

	sqlStmt, err := db.Prepare(`INSERT INTO events (
        groupId,
        userId,
        text,
        title,
        datetime,
        creationDate
    ) VALUES (?, ?, ?, ?, ?, ?)`)

	if err != nil {
		return nil, err
	}

	creationDate := time.Now().UnixMilli()

	sqlResult, err := sqlStmt.Exec(groupId, userId, text, title, datetime, creationDate)
	if err != nil {
		return nil, err
	}
	eventId, err := sqlResult.LastInsertId()
	if err != nil {
		return nil, err
	}

	defaultIsGoing := 1

	event := &models.CreatePostEventResponse{
		Id:       int(eventId),
		UserId:   userId,
		Text:     text,
		Title:    &title,
		DateTime: &datetime,
		IsGoing:  &defaultIsGoing,
	}

	return event, nil
}

func CreateGroupPost(groupId, userId int, text string) (*models.CreatePostEventResponse, error) {
	if text == "" {
		return nil, eh.NewErrorResponse(eh.ErrEmptyInput, "no input provided")
	}

	sqlStmt, err := db.Prepare(`INSERT INTO posts (
        groupId,
        userId,
        text,
        creationDate,
        privacy
    ) VALUES (?, ?, ?, ?, ?)`)

	if err != nil {
		return nil, err
	}

	creationDate := time.Now().UnixMilli()

	sqlResult, err := sqlStmt.Exec(groupId, userId, text, creationDate, 3)
	if err != nil {
		return nil, err
	}
	postId, err := sqlResult.LastInsertId()
	if err != nil {
		return nil, err
	}

	event := &models.CreatePostEventResponse{
		Id:     int(postId),
		UserId: userId,
		Text:   text,
	}

	return event, nil
}

func GetAllPosts(groupId int) ([]models.CreatePostEventResponse, error) {
	rows, err := db.Query(`
	SELECT 
		id,
		text,
		userId
	FROM posts
	WHERE groupId = ?`, groupId)
	if err != nil {
		return nil, err
	}

	posts := make([]models.CreatePostEventResponse, 0)

	for rows.Next() {
		temp := models.CreatePostEventResponse{}
		err = rows.Scan(&temp.Id, &temp.Text, &temp.UserId)
		if err != nil {
			return nil, err
		}

		posts = append(posts, temp)
	}

	return posts, nil
}

func GetAllEvents(groupId, userId int) ([]models.CreatePostEventResponse, error) {
	rows, err := db.Query(`
	SELECT 
		id,
		text,
		userId,
		title,
		datetime,
		(
			SELECT isGoing
			FROM events_actions
			WHERE eventId = events.id
				AND userId = ?
		)
	FROM events
	WHERE groupId = ?`, userId, groupId)
	if err != nil {
		return nil, err
	}

	events := make([]models.CreatePostEventResponse, 0)

	for rows.Next() {
		temp := models.CreatePostEventResponse{}
		err = rows.Scan(&temp.Id, &temp.Text, &temp.UserId, &temp.Title, &temp.DateTime, &temp.IsGoing)
		if err != nil {
			return nil, err
		}

		if temp.IsGoing == nil {
			temp.IsGoing = setIsGoing(1)
		} else if *temp.IsGoing != 1 {
			temp.IsGoing = setIsGoing(2)
		} else if *temp.IsGoing == 1 {
			temp.IsGoing = setIsGoing(3)
		}

		events = append(events, temp)
	}

	return events, nil
}
