package main

import (
	"log"
	"net/http"
	"social-network/packages/controllers"
	"social-network/packages/router"
)

func main() {
	r := router.Router{}

	r.NewRoute("POST", "/register", controllers.RegistrationHandler)
	r.NewRoute("POST", "/login", controllers.LoginHandler)
	r.NewRoute("POST", "/logout", controllers.LogoutHandler)

	r.NewRoute("GET", `/user/(?P<id>\d+)`, controllers.GetProfile)
	r.NewRoute("GET", `/user/(?P<id>\d+)/posts`, controllers.GetPosts)
	r.NewRoute("GET", `/user/(?P<id>\d+)/chats`, controllers.GetChats)
	r.NewRoute("GET", `/user/(?P<id>\d+)/groups`, controllers.GetGroups)
	r.NewRoute("GET", `/user/(?P<id>\d+)/followers`, controllers.GetFollowers)
	r.NewRoute("GET", `/user/(?P<id>\d+)/followings`, controllers.GetFollowings)

	r.NewRoute("POST", `/user/(?P<id>\d+)/posts`, controllers.CreatePost)
	r.NewRoute("POST", `/user/(?P<id>\d+)/chats`, controllers.CreateChat)
	r.NewRoute("POST", `/user/(?P<id>\d+)/groups`, controllers.CreateGroup)
	r.NewRoute("PUT", `/user/(?P<id>\d+)/followers`, controllers.UpdateFollowers)

	r.NewRoute("GET", `/post/(?P<id>\d+)`, controllers.GetPost)
	r.NewRoute("GET", `/post/(?P<id>\d+)/comments`, controllers.GetComments)
	r.NewRoute("POST", `/post/(?P<id>\d+)/comments`, controllers.CreateComment)
	r.NewRoute("PUT", `/post/(?P<id>\d+)`, controllers.UpdatePost)

	r.NewRoute("GET", `/comment/(?P<id>\d+)`, controllers.GetComment)

	r.NewRoute("GET", `/chat/(?P<id>\d+)`, controllers.GetChat)
	r.NewRoute("POST", `/chat/(?P<id>\d+)`, controllers.CreateMessage)

	r.NewRoute("GET", `/groups`, controllers.GetAllGroups)

	r.NewRoute("GET", `/group/(?P<id>\d+)`, controllers.GetGroup)
	r.NewRoute("PUT", `/group/(?P<id>\d+)`, controllers.UpdateGroup)

	http.HandleFunc("/", r.Serve)

	log.Println("Ctrl + Click on the link: http://localhost:8080")
	log.Println("To stop the server press `Ctrl + C`")

	log.Fatal(http.ListenAndServe(":8080", nil))
}
