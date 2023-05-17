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
