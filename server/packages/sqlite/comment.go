package sqlite

import (
	"database/sql"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"time"
)

func CreateComment(postId, userId int, comment models.CreateCommentRequest) (*models.CreateCommentResponse, error) {
	sqlStmt, err := db.Prepare(`INSERT INTO comments (postId, userId, text, creationDate)
	VALUES (?, ?, ?, ?);`)
	if err != nil {
		return nil, err
	}

	creationDate := time.Now().UnixMilli()

	result, err := sqlStmt.Exec(postId, userId, comment.Text, creationDate)
	if err != nil {
		return nil, err
	}

	commentId, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	sqlStmt, err = db.Prepare(`INSERT INTO comment_images (commentId, image)
	VALUES (?, ?)`)
	if err != nil {
		return nil, err
	}

	for _, image := range comment.Attachments {
		_, err := sqlStmt.Exec(commentId, image)
		if err != nil {
			return nil, err
		}
	}

	return &models.CreateCommentResponse{
		Id:           int(commentId),
		UserId:       userId,
		PostId:       postId,
		Text:         comment.Text,
		Attachments:  comment.Attachments,
		CreationDate: int(creationDate),
	}, nil
}

func GetCommentsByPostId(postId int) ([]int, error) {
	comments := []int{}
	rows, err := db.Query("SELECT id FROM comments WHERE postId = ?", postId)
	if err != nil {
		return []int{}, err
	}

	for rows.Next() {
		id := 0

		err = rows.Scan(&id)
		if err != nil {
			return []int{}, err
		}
		comments = append(comments, id)
	}

	return comments, nil
}

func GetCommentById(commentId int, userId int) (*models.CreateCommentResponse, error) {
	comment := models.CreateCommentResponse{}
	err := db.QueryRow("SELECT id, postId, userId, text, creationDate FROM comments WHERE id = ?", commentId).
		Scan(&comment.Id, &comment.PostId, &comment.UserId, &comment.Text, &comment.CreationDate)

	if err == sql.ErrNoRows {
		return nil, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}

	if err != nil {
		return nil, err
	}

	post, err := GetPostById(comment.PostId, userId)
	if err != nil {
		return nil, err
	}

	if post.GroupId != 0 {
		group, err := GetGroupById(post.GroupId, userId)
		if err != nil {
			return nil, err
		}
		if group.JoinStatus != 3 {
			return nil, eh.NewErrorResponse(eh.ErrNoAccess, "no access to this action")
		}
	}

	attachments, err := GetCommentAttachments(comment.Id)
	if err != nil {
		return nil, err
	}

	comment.Attachments = attachments

	return &comment, nil
}

func GetCommentAttachments(commentId int) ([]string, error) {
	attachments := []string{}
	rows, err := db.Query("SELECT image FROM comment_images WHERE commentId = ?", commentId)
	if err != nil {
		return []string{}, err
	}

	for rows.Next() {
		temp := ""
		err = rows.Scan(&temp)
		if err != nil {
			return []string{}, err
		}
		attachments = append(attachments, temp)
	}

	return attachments, nil
}
