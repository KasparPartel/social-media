package models

type GetUserResponse struct {
	Id           int     `json:"id"`
	Avatar       string  `json:"avatar"`
	Email        string  `json:"email"`
	Login        *string `json:"login"`
	FirstName    string  `json:"firstName"`
	LastName     string  `json:"lastName"`
	AboutMe      string  `json:"aboutMe"`
	DateOfBirth  int     `json:"dateOfBirth"`
	FollowStatus int     `json:"followStatus"` // 1 - public, 2 - almost private, 3 - private
	IsPublic     bool    `json:"isPublic"`
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
	Id           int      `json:"id"`                // post id
	UserId       int      `json:"userId"`            // creator post id
	GroupId      int      `json:"groupId,omitempty"` // group post id
	Text         string   `json:"text"`
	Attachments  []string `json:"attachments"` // of image/gif encoded with base64
	CreationDate int      `json:"creationDate"`
}

type CreateCommentRequest struct {
	Text        string   `json:"text"`
	Attachments []string `json:"attachments"`
}

type CreateCommentResponse struct {
	Id           int      `json:"id"`
	UserId       int      `json:"userId"`
	PostId       int      `json:"postId"`
	Text         string   `json:"text"`
	Attachments  []string `json:"attachments"`
	CreationDate int      `json:"creationDate"`
}

type CreateGroupRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type CreateGroupResponse struct {
	Id           int    `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	CreationDate int    `json:"creationDate"`
	UserId       int    `json:"userId"`
}

type GetGroupInfoResponse struct {
	Id         int    `json:"id"`         // group id
	Title      string `json:"title"`      // group title
	IsOwner    bool   `json:"isOwner"`    // boolean
	JoinStatus int    `json:"joinStatus"` // 1 - not joined, 2 - requested, 3 - joined
}

type GetGroupResponse struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	JoinStatus  int    `json:"joinStatus"`
	IsOwner     bool   `json:"isOwner"`
}

type InviteToGroup struct {
	Users []int `json:"users"`
}

type UpdateJoinStatus struct {
	JoinStatus int `json:"joinStatus"`
}

type CreatePostEventRequest struct {
	Text     string `json:"text"`
	IsEvent  bool   `json:"isEvent"`
	Title    string `json:"title"`
	DateTime int    `json:"datetime"` // milliseconds
}

type CreatePostEventResponse struct {
	Id       int     `json:"id"`
	UserId   int     `json:"userId"`
	Text     string  `json:"text"`
	Title    *string `json:"title,omitempty"`
	DateTime *int    `json:"datetime,omitempty"` // milliseconds
	IsGoing  *int    `json:"isGoing,omitempty"`  // always 1 if isEvent
	GroupId  int     `json:"-"`
}

type GetGroupFeedResponse struct {
	Posts  []CreatePostEventResponse `json:"posts"`
	Events []CreatePostEventResponse `json:"events"`
}

type ChangeEventAction struct {
	IsGoing int `json:"isGoing"`
}
