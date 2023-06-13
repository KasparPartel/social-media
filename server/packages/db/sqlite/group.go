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
		)
	FROM groups`, userId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		tempGroup := models.GetGroupInfoResponse{JoinStatus: 1}
		ownerId := 0
		var isAccepted *int

		err = rows.Scan(&tempGroup.Id, &tempGroup.Title, &ownerId, &isAccepted)
		if err != nil {
			return nil, err
		}

		switch {
		case ownerId == userId || (isAccepted != nil && *isAccepted == 1):
			tempGroup.JoinStatus = 3
		case isAccepted != nil && *isAccepted == 0:
			tempGroup.JoinStatus = 2
		default:
			tempGroup.JoinStatus = 1
		}

		groups = append(groups, tempGroup)
	}

	return groups, nil
}
