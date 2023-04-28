package sqlite

import (
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
