package sqlite

import (
	"database/sql"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"time"
)

func GetUserPosts(u *User, followerId int) ([]int, error) {
	postIds := make([]int, 0)

	q := `SELECT id,
			privacy,
			(
				SELECT count(1)
				FROM postAllows
				WHERE postId = posts.id
					AND userId = ?
			)
		FROM posts
		WHERE userId = ?`

	rows, err := db.Query(q, followerId, u.Id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	for rows.Next() {
		id, privacy, allowed := 0, 0, false
		rows.Scan(&id, &privacy, &allowed)
		if (u.Id == followerId) || (u.IsPublic && privacy == 1) ||
			(u.FollowStatus == 3 && (privacy == 1 || privacy == 2 || (privacy == 3 && allowed))) {
			postIds = append(postIds, id)
		}
	}
	return postIds, nil
}

func CreateUserPost(userId int, post models.CreatePostRequest) (int, int, error) {
	sqlStmt, err := db.Prepare(`INSERT INTO posts(userId, text, creationDate, privacy) VALUES(?, ?, ?, ?)`)
	if err != nil {
		return 0, 0, err
	}

	creationDate := time.Now().UnixMilli()

	result, err := sqlStmt.Exec(userId, post.Text, creationDate, post.Privacy)
	if err != nil {
		return 0, 0, err
	}

	postId, err := result.LastInsertId()
	if err != nil {
		return 0, 0, err
	}

	sqlStmt, err = db.Prepare(`INSERT INTO postAllows(postId, userId) VALUES(?, ?)`)
	if err != nil {
		return 0, 0, err
	}
	for _, id := range post.AuthorizedFollowers {
		_, err := sqlStmt.Exec(postId, id)
		if err != nil {
			return 0, 0, err
		}
	}

	sqlStmt, err = db.Prepare(`INSERT INTO postImages(postId, path) VALUES(?, ?)`)
	if err != nil {
		return 0, 0, err
	}
	for _, image := range post.Attachments {
		_, err := sqlStmt.Exec(postId, image)
		if err != nil {
			return 0, 0, err
		}
	}

	return int(postId), int(creationDate), nil
}

func GetPostById(postId, followerId int) (*models.GetPostResponse, error) {
	post := models.GetPostResponse{}
	privacy := 0
	allowed := false

	q := `SELECT id,
			userId,
			text,
			creationDate,
			privacy,
			(
				SELECT count(1)
				FROM postAllows
				WHERE postId = posts.id
					AND userId = ?
			)
		FROM posts
		WHERE id = ?;`

	err := db.QueryRow(q, followerId, postId).Scan(&post.Id, &post.UserId, &post.Text, &post.CreationDate, &privacy, &allowed)
	if err == sql.ErrNoRows {
		return nil, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}

	if err != nil {
		return nil, err
	}

	u, err := GetUserById(post.UserId)
	if err != nil {
		return nil, err
	}

	u.FollowStatus, err = GetFollowStatus(u.Id, followerId)
	if err != nil {
		return nil, err
	}

	if (u.Id != followerId) && (!u.IsPublic || privacy != 1) &&
		(u.FollowStatus != 3 || (privacy != 1 && privacy != 2 && (privacy != 3 || !allowed))) {
		return nil, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}

	post.Attachments, err = GetPostAttachments(post.Id)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

func GetPostAttachments(postId int) ([]string, error) {
	attachments := make([]string, 0)

	q := `SELECT path
		FROM postImages
		where postId = ?`

	rows, err := db.Query(q, postId)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	for rows.Next() {
		temp := ""
		rows.Scan(&temp)
		attachments = append(attachments, temp)
	}

	return attachments, nil
}

func GetEventById(eventId, userId int) (*models.CreatePostEventResponse, error) {
	event := &models.CreatePostEventResponse{}
	var isGoing *bool

	err := db.QueryRow(`SELECT id,
	userId,
	text,
	title,
	datetime,
	groupId,
	(
		SELECT isGoing
		FROM events_actions
		WHERE eventId = events.id
			AND userId = ?
	)
	FROM events
	WHERE id = ?;`, userId, eventId).
		Scan(&event.Id, &event.UserId, &event.Text, &event.Title, &event.DateTime, &event.GroupId, &isGoing)
	if err == sql.ErrNoRows {
		return nil, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}
	if err != nil {
		return nil, err
	}

	if isGoing == nil {
		event.IsGoing = setIsGoing(1)
	} else if !*isGoing {
		event.IsGoing = setIsGoing(2)
	} else if *isGoing {
		event.IsGoing = setIsGoing(3)
	}

	return event, nil
}

func setIsGoing(status int) *int {
	return &status
}

func AddEventStatus(eventId, userId, statusToSet int) (int, error) {
	sqlStmt, err := db.Prepare(`INSERT INTO events_actions(eventId, userId, isGoing)
		VALUES(?, ?, ?)`)
	if err != nil {
		return 0, err
	}

	_, err = sqlStmt.Exec(eventId, userId, statusToSet == 3) // 3 = going
	if err != nil {
		return 0, err
	}

	return statusToSet, nil
}

func UpdateEventStatus(eventId, userId, statusToSet int) (int, error) {
	sqlStmt, err := db.Prepare(`UPDATE events_actions
		SET isGoing = ?
		WHERE eventId = ?
		AND userId = ?`)
	if err != nil {
		return 0, err
	}

	_, err = sqlStmt.Exec(statusToSet == 3, eventId, userId) // 3 = going
	if err != nil {
		return 0, err
	}

	return statusToSet, nil
}

func DeleteEventStatus(eventId, userId, statusToSet int) (int, error) {
	sqlStmt, err := db.Prepare(`DELETE FROM events_actions
		WHERE eventId = ? AND userId = ?`)
	if err != nil {
		return 0, err
	}

	_, err = sqlStmt.Exec(eventId, userId)
	if err != nil {
		return 0, err
	}

	return statusToSet, nil
}
