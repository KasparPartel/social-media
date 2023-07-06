package sqlite

import (
	"database/sql"
	"social-network/packages/models"
)

func GetOrCreateGroupChat(groupId int) (*models.Chat, error) {
	chat := &models.Chat{}
	err := db.QueryRow(`SELECT id, user_1, user_2, groupId FROM chat WHERE groupId = ?`, groupId).
		Scan(&chat.Id, &chat.User1, &chat.User2, &chat.GroupId)
	if err == nil {
		return chat, err
	}
	if err != sql.ErrNoRows {
		return nil, err
	}

	result, err := db.Exec(`INSERT INTO chat (groupId)
	VALUES (?);`, groupId)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	chat.Id = int(id)
	chat.GroupId = groupId

	return chat, nil
}

func GetOrCreatePrivateChat(userId1, userId2 int) (*models.Chat, error) {
	chat := &models.Chat{}
	err := db.QueryRow(`SELECT id, user_1, user_2, groupId FROM chat WHERE (user_1 = ? AND user_2 = ?) OR (user_1 = ? AND user_2 = ?))`, userId1, userId2, userId2, userId1).
		Scan(&chat.Id, &chat.User1, &chat.User2, &chat.GroupId)
	if err == nil {
		return chat, err
	}
	if err != sql.ErrNoRows {
		return nil, err
	}

	result, err := db.Exec(`INSERT INTO chat (groupId)
	VALUES (?);`, userId1)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	chat.Id = int(id)
	chat.GroupId = userId1

	return chat, nil
}
