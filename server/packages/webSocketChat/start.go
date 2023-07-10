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

	client := &Client{
		conn:   ws,
		userId: requestUserId,
	}

	connections.AddConnection(requestUserId, client)
	closeHandler := ws.CloseHandler()

	ws.SetCloseHandler(func(code int, text string) error {
		connections.RemoveClientFromChat(client)
		connections.RemoveConnection(client)
		closeHandler(code, text)
		log.Printf("[DISCONNECTED] Client with id: %d disconnected. Chats: %+v\nConnections: %+v\n", requestUserId, connections.chats, connections.connectionList)
		return nil
	})

	log.Printf("[CONNECTED] Client with id: %d connected. Chats: %+v\nConnections: %+v\n", requestUserId, connections.chats, connections.connectionList)

	readMessage(client)
}

func init() {
	connections = RealTimeConnections{
		connectionList: make(map[int]map[*Client]bool),
		chats:          make(map[int]*Chat),
	}
}
