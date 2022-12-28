package main

import (
	"log"
	"net/http"
	"social-network/packages/controllers"
)

func main() {
	http.HandleFunc("/user/", controllers.UserHandler)
	http.HandleFunc("/post/", controllers.PostHandler)
	http.HandleFunc("/comment/", controllers.GetCommentHandler)
	http.HandleFunc("/chat/", controllers.ChatHandler)
	http.HandleFunc("/groups/", controllers.GetGroupsHandler)
	http.HandleFunc("/group/", controllers.GroupHandler)

	log.Println("Ctrl + Click on the link: http://localhost:8080")
	log.Println("To stop the server press `Ctrl + C`")

	log.Fatal(http.ListenAndServe(":8080", nil))
}
