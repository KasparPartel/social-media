package websocketchat

import "github.com/gorilla/websocket"

type Client struct {
	userId int
	conn   *websocket.Conn
	chat   *Chat
}

type Chat struct {
	chatId int
	conns  map[*Client]bool
}

type RealTimeConnections struct {
	connectionList map[int]*Client // key is userId
	chats          map[int]*Chat   // key is chatId
}

type BaseMapPayload map[string]interface{}

type BasePayload[T MessageResponse | []MessageResponse] struct {
	EventType string `json:"eventType"`
	Payload   T      `json:"payload"`
}

type MessageResponse struct {
	UserId    int    `json:"userId"`
	Content   string `json:"content"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type MessageRecieve struct {
	Content string `json:"content"`
}

type SwitchChat struct {
	Id      int  `json:"id"`
	IsGroup bool `json:"isGroup"`
}
