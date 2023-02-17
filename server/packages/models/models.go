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
