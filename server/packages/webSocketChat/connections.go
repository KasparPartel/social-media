package websocketchat

import "github.com/gorilla/websocket"

func (c *RealTimeConnections) AddConnection(userId int, ws *websocket.Conn) *Client {
	client := &Client{
		conn:   ws,
		userId: userId,
	}

	connections.connectionList[userId] = client

	return client
}
