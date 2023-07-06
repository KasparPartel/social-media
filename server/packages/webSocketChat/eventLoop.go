package websocketchat

import (
	"fmt"
	"log"
	"social-network/packages/db/sqlite"
	"social-network/packages/models"
)

func readMessage(client *Client) {
	var event BaseMapPayload

	for client != nil && client.conn != nil {
		err := client.conn.ReadJSON(&event)
		if err != nil {
			log.Println(err)
			client.conn.Close()
			return
		}

		fmt.Printf("%v", event)

		switch event["eventType"] {
		case "join":
			action, err := getPayload[SwitchChat](event)
			if err != nil {
				log.Println(event, err)
				continue
			}

			chat := &models.Chat{}

			if action.IsGroup {
				chat, err = sqlite.GetOrCreateGroupChat(action.Id)
				if err != nil {
					log.Println(event, err)
					continue
				}
			} else {
				chat, err = sqlite.GetOrCreatePrivateChat(action.Id, client.userId)
				if err != nil {
					log.Println(event, err)
					continue
				}
			}
			currentChat := connections.AddChat(chat.Id, client)
			client.chat = currentChat
		case "leave":
		case "message":
			if client.chat == nil {
				continue
			}
		default:
			continue
		}
	}
}

func getPayload[T SwitchChat | MessageRecieve](event BaseMapPayload) (*T, error) {
	if payload, exists := event["payload"]; exists {
		if action, ok := payload.(T); ok {
			return &action, nil
		}
		return nil, fmt.Errorf("bad request")
	}
	return nil, fmt.Errorf("no such field payload")
}
