package websocketchat

import (
	"encoding/json"
	"log"
	"net/http"
	eh "social-network/packages/errorHandler"
	"social-network/packages/session"

	"github.com/gorilla/websocket"
)

var connections RealTimeConnections

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

	client := connections.AddConnection(requestUserId, ws)

	ws.SetCloseHandler(CloseConnection(client, ws))

	log.Printf("User with id %d connected via WebSocket\n", requestUserId)

	readMessage(client)
}

func CloseConnection(client *Client, ws *websocket.Conn) func(code int, text string) error {
	closeHandler := ws.CloseHandler()
	return func(code int, text string) error {
		log.Printf("client %v disconnected\n", client)
		closeHandler(code, text)
		client.RemoveClientFromChat()
		connections.RemoveConnection(client)
		return nil
	}
}

func init() {
	connections = RealTimeConnections{
		connectionList: make(map[int]map[*Client]bool),
		chats:          make(map[int]*Chat),
	}
}
