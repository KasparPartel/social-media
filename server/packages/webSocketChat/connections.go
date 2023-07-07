package websocketchat

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
