package websocketchat

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
