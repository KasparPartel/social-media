package websocketchat

import (
	"social-network/packages/models"
	"sync"

	"github.com/gorilla/websocket"
)

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
	connectionList map[int]map[*Client]bool // key is userId
	chats          map[int]*Chat            // key is chatId
	mu             sync.Mutex
}

type BaseMapPayload map[string]interface{}

type BasePayload[T models.Message | []models.Message] struct {
	EventType string `json:"eventType"`
	Payload   T      `json:"payload"`
}

type MessageRecieve struct {
	Content string `json:"content"`
}

type SwitchChat struct {
	Id      int  `json:"id"`
	IsGroup bool `json:"isGroup"`
}
