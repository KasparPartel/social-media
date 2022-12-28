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

// GET POST user/:id/chats/
func GetChatsHandler(w http.ResponseWriter, r *http.Request, id int) {
	if r.Method != "GET" && r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get list of chats id
	if r.Method == "GET" {
		chatsArray := []int{56, 666, 23, 45, 66}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(chatsArray)
		return
	}

	if r.Method == "POST" {
		// create new chat
	}
}

// GET POST chat/:id/
func ChatHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// get list of messages in chat
	if r.Method == "GET" {
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
		return
	}

	if r.Method == "POST" {
		// create new message
	}
}
