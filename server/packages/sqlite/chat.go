package sqlite

import (
	"database/sql"
	"social-network/packages/models"
	"time"
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
	chat.GroupId = &groupId

	return chat, nil
}

func GetOrCreatePrivateChat(userId1, userId2 int) (*models.Chat, error) {
	chat := &models.Chat{}
	err := db.QueryRow(`SELECT id, user_1, user_2, groupId FROM chat WHERE (user_1 = ? AND user_2 = ?) OR (user_1 = ? AND user_2 = ?)`, userId1, userId2, userId2, userId1).
		Scan(&chat.Id, &chat.User1, &chat.User2, &chat.GroupId)
	if err == nil {
		return chat, err
	}
	if err != sql.ErrNoRows {
		return nil, err
	}
	result, err := db.Exec(`INSERT INTO chat (user_1, user_2)
	VALUES (?, ?);`, userId1, userId2)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	chat.Id = int(id)
	chat.User1 = &userId1
	chat.User2 = &userId2

	return chat, nil
}

func GetMessagesByChatId(chatId int) ([]models.Message, error) {
	rows, err := db.Query(`SELECT message.id,
    message.chatId,
    message.userId,
    message.text,
    message.creationDate,
    users.firstName,
    users.lastName
	FROM message,
		users
	WHERE chatId = ?
		AND message.userId = users.id`, chatId)
	if err != nil {
		return nil, err
	}

	messages := []models.Message{}

	for rows.Next() {
		m := models.Message{}
		err = rows.Scan(&m.Id, &m.ChatId, &m.UserId, &m.Text, &m.CreationDate, &m.FirstName, &m.LastName)
		if err != nil {
			return nil, err
		}

		messages = append(messages, m)
	}

	return messages, nil
}

func CreateMessageByChatId(chatId, userId int, content string) (*models.Message, error) {
	creationDate := time.Now().UnixMilli()
	result, err := db.Exec(`INSERT INTO message (chatId, userId, text, creationDate)
	VALUES (?, ?, ?, ?);`, chatId, userId, content, creationDate)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	u, err := GetUserById(userId)
	if err != nil {
		return nil, err
	}

	return &models.Message{
		Id:           int(id),
		ChatId:       chatId,
		UserId:       userId,
		FirstName:    u.FirstName,
		LastName:     u.LastName,
		Text:         content,
		CreationDate: int(creationDate),
	}, nil
}
