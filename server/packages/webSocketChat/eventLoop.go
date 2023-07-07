package websocketchat

import (
	"encoding/json"
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

		fmt.Printf("event: %v\n", event)

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

			messages, err := sqlite.GetMessagesByChatId(currentChat.chatId)
			if err != nil {
				log.Println(event, err)
				continue
			}

			err = client.conn.WriteJSON(BasePayload[[]models.Message]{
				EventType: "message",
				Payload:   messages,
			})
			if err != nil {
				log.Println(event, err)
				continue
			}
		case "leave":
			connections.RemoveClientFromChat(client)
		case "message":
			if client.chat == nil {
				continue
			}

			action, err := getPayload[MessageRecieve](event)
			if err != nil {
				log.Println(event, err)
				continue
			}

			message, err := sqlite.CreateMessageByChatId(client.chat.chatId, client.userId, action.Content)
			if err != nil {
				log.Println(event, err)
				continue
			}

			err = client.chat.SendMessageToAllUsers(*message)
			if err != nil {
				log.Println(event, err)
				continue
			}
		default:
			continue
		}
	}
}

func getPayload[T SwitchChat | MessageRecieve](event BaseMapPayload) (*T, error) {
	if payload, exists := event["payload"]; exists {
		v, err := json.Marshal(payload)
		if err != nil {
			return nil, err
		}

		var temp *T = new(T)

		err = json.Unmarshal(v, &temp)
		if err != nil {
			return nil, err
		}

		return temp, nil
	}
	return nil, fmt.Errorf("no such field payload")
}
