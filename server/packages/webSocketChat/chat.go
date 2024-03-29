package websocketchat

import (
	"log"
	"social-network/packages/models"
)

func (c *RealTimeConnections) AddChat(chatId int, client *Client) *Chat {
	if chat, exists := c.chats[chatId]; exists {
		chat.conns[client] = true
		return chat
	}

	chat := &Chat{
		chatId: chatId,
		conns:  map[*Client]bool{client: true},
	}
	c.chats[chatId] = chat
	return chat
}

func (c *RealTimeConnections) RemoveClientFromChat(client *Client) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if client.chat == nil {
		return
	}

	delete(client.chat.conns, client)
	client.chat = nil
}

func (c *Chat) SendMessageToAllUsers(message models.Message) error {
	for client := range c.conns {
		if client.conn == nil {
			log.Println("bruh")
			continue
		}
		err := client.conn.WriteJSON(BasePayload[models.Message]{
			EventType: "message",
			Payload:   message,
		})
		if err != nil {
			return err
		}
	}

	return nil
}
