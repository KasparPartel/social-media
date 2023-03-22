package controllers

import (
	"encoding/json"
	"net/http"
)

type Chat struct {
	ChatId       int       `json:"chatId"`
	Messages     []Message `json:"messages"`
	FirstUserId  int       `json:"firstUserId"`
	SecondUserId int       `json:"secondUserId"`
}

type Message struct {
	MessageId int    `json:"messageId"`
	UserId    int    `json:"userId"`
	Login     string `json:"login"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Text      string `json:"text"`
}

// GET user/:id/chats
func GetChats(w http.ResponseWriter, r *http.Request) {
	chatsArray := []int{56, 666, 23, 45, 66}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chatsArray)
}

// POST user/:id/chats
func CreateChat(w http.ResponseWriter, r *http.Request) {
	chatsArray := []int{56, 666, 23, 45, 66}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chatsArray)
}

// GET chat/:id/
func GetChat(w http.ResponseWriter, r *http.Request) {
	testChat := &Chat{
		ChatId:       1,
		FirstUserId:  12,
		SecondUserId: 54,
		Messages: []Message{
			{
				MessageId: 334,
				UserId:    12,
				Login:     "first",
				FirstName: "John",
				Text:      "Hello!",
			},
			{
				MessageId: 335,
				UserId:    54,
				Login:     "second",
				FirstName: "notJohn",
				Text:      "Hello!:)",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(testChat)
}

// POST chat/:id/
func CreateMessage(w http.ResponseWriter, r *http.Request) {
	testChat := &Chat{
		ChatId:       1,
		FirstUserId:  12,
		SecondUserId: 54,
		Messages: []Message{
			{
				MessageId: 334,
				UserId:    12,
				Login:     "first",
				FirstName: "John",
				Text:      "Hello!",
			},
			{
				MessageId: 335,
				UserId:    54,
				Login:     "second",
				FirstName: "notJohn",
				Text:      "Hello!:)",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(testChat)
}
