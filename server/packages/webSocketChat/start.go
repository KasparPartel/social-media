package websocketchat

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	eh "social-network/packages/errorHandler"
	"social-network/packages/session"

	"github.com/gorilla/websocket"
)

type Client struct {
	conn   *websocket.Conn
	userId int
}

var connectionList map[int]*Client

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WebSocket(w http.ResponseWriter, r *http.Request) {
	response := &eh.Response{}
	s, err := session.SessionProvider.GetSession(r)
	if errRes, ok := err.(*eh.ErrorResponse); ok {
		response.Errors = []*eh.ErrorResponse{errRes}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	requestUserId := s.GetUID()

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	client := &Client{
		conn:   ws,
		userId: requestUserId,
	}

	connectionList[requestUserId] = client

	log.Printf("User with id %d connected via WebSocket\n", requestUserId)

	readMessage(client)
}

func readMessage(client *Client) {
	for client != nil && client.conn != nil {
		_, p, err := client.conn.ReadMessage()
		if err != nil {
			log.Println(err)
			// connectionClose(userId)
			return
		}

		fmt.Println(string(p))
	}
}

func init() {
	connectionList = make(map[int]*Client)
}
