package websocketchat

import "github.com/gorilla/websocket"

func (c *RealTimeConnections) AddConnection(userId int, ws *websocket.Conn) *Client {
	client := &Client{
		conn:   ws,
		userId: userId,
	}

	if connection, exists := c.connectionList[userId]; exists {
		connection[client] = true
		c.connectionList[userId] = connection
	} else {
		c.connectionList[userId] = map[*Client]bool{client: true}
	}

	return client
}

func (c *RealTimeConnections) RemoveConnection(client *Client) {
	if _, exists := c.connectionList[client.userId]; exists {
		delete(c.connectionList[client.userId], client)
	}
}
