package models

type GetUserResponse struct {
	Id          int     `json:"id"`
	Avatar      string  `json:"avatar"`
	Email       string  `json:"email"`
	Login       *string `json:"login"`
	FirstName   string  `json:"firstName"`
	LastName    string  `json:"lastName"`
	AboutMe     string  `json:"aboutMe"`
	DateOfBirth int     `json:"dateOfBirth"`
	IsPublic    bool    `json:"isPublic"`
}

type UpdateFollowersResponse struct {
	FollowStatus int `json:"followStatus"`
}

type CreatePostRequest struct {
	Text                string   `json:"text"`
	Attachments         []string `json:"attachments"` // of image/gif encoded with base64
	Privacy             int      `json:"privacy"`     // 1 - public, 2 - almost private, 3 - private
	AuthorizedFollowers []int    `json:"authorizedFollowers"`
}

type GetPostResponse struct {
	Id                  int      `json:"id"`     // post id
	UserId              int      `json:"userId"` // creator post id
	Text                string   `json:"text"`
	Attachments         []string `json:"attachments"` // of image/gif encoded with base64
	AuthorizedFollowers []int    `json:"authorizedFollowers"`
	Comments            []int    `json:"comments"`
	CreationDate        int      `json:"creationDate"`
}
