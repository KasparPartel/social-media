package websocketchat

import (
	"social-network/packages/models"
)

func (c *RealTimeConnections) AddConnection(userId int, client *Client) {
	if connection, exists := c.connectionList[userId]; exists {
		connection[client] = true
		c.connectionList[userId] = connection
	} else {
		c.connectionList[userId] = map[*Client]bool{client: true}
	}
}

func (c *RealTimeConnections) RemoveConnection(client *Client) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if _, exists := c.connectionList[client.userId]; exists {
		delete(c.connectionList[client.userId], client)
	}
}

func (c *RealTimeConnections) SendMessageToUsers(userIds []int, message models.CreatePostEventResponse) error {
	conns := Connections.connectionList

	for _, id := range userIds {
		for client := range conns[id] {
			if client == nil {
				continue
			}
			err := client.conn.WriteJSON(BasePayload[models.CreatePostEventResponse]{
				EventType: "notifications",
				Payload:   message,
			})
			if err != nil {
				return err
			}
		}
	}

	return nil
}
