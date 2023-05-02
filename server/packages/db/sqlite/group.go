package sqlite

import (
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
