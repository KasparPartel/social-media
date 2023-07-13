package main

import (
	"log"
	"net/http"
	"social-network/packages/controllers"
	"social-network/packages/httpRouting"
	websocketchat "social-network/packages/webSocketChat"
)

func main() {
	r := httpRouting.NewRouter()
	c := httpRouting.CORS{
		Origin:      "http://localhost:3000",
		Headers:     []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token"},
		Methods:     []string{"POST", "GET", "OPTIONS", "PUT"},
		Credentials: true,
	}

	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	r.NewRoute("POST", "/register", controllers.RegistrationHandler)
	r.NewRoute("POST", "/login", controllers.LoginHandler)
	r.NewRoute("POST", "/logout", controllers.LogoutHandler)

	r.NewRoute("GET", `/user/(?P<id>\d+)`, controllers.GetUserInfo)
	r.NewRoute("GET", `/user/(?P<id>\d+)/posts`, controllers.GetPosts)
	r.NewRoute("GET", `/user/(?P<id>\d+)/followers`, controllers.GetFollowers)
	r.NewRoute("GET", `/user/(?P<id>\d+)/followings`, controllers.GetFollowings)
	r.NewRoute("GET", `/users`, controllers.GetAllUsers)

	r.NewRoute("POST", `/user/(?P<id>\d+)/posts`, controllers.CreatePost)
	r.NewRoute("PUT", `/user/(?P<id>\d+)/followers`, controllers.UpdateFollowers)
	r.NewRoute("POST", `/user/(?P<id>\d+)/followings/accept`, controllers.AcceptFollowRequest)
	r.NewRoute("POST", `/user/(?P<id>\d+)/followings/reject`, controllers.RejectFollowRequest)
	r.NewRoute("PUT", `/user/(?P<id>\d+)`, controllers.UpdateUserInfo)

	r.NewRoute("GET", `/post/(?P<id>\d+)`, controllers.GetPost)
	r.NewRoute("GET", `/post/(?P<id>\d+)/comments`, controllers.GetComments)
	r.NewRoute("POST", `/post/(?P<id>\d+)/comments`, controllers.CreateComment)

	r.NewRoute("GET", `/comment/(?P<id>\d+)`, controllers.GetComment)

	r.NewRoute("GET", `/groups`, controllers.GetAllGroups)
	r.NewRoute("POST", `/groups`, controllers.CreateGroup)

	r.NewRoute("GET", `/group/(?P<id>\d+)`, controllers.GetGroup)
	r.NewRoute("POST", `/group/(?P<id>\d+)/invite`, controllers.InviteToGroup)
	r.NewRoute("POST", `/group/(?P<id>\d+)/invite/(?P<userId>\d+)/accept`, controllers.AcceptJoinRequest)
	r.NewRoute("POST", `/group/(?P<id>\d+)/invite/(?P<userId>\d+)/reject`, controllers.RejectJoinRequest)
	r.NewRoute("POST", `/group/(?P<id>\d+)/(?P<action>leave|join)`, controllers.JoinLeaveGroup)
	r.NewRoute("POST", `/group/(?P<id>\d+)/join/accept`, controllers.AcceptInvitationRequest)
	r.NewRoute("POST", `/group/(?P<id>\d+)/join/reject`, controllers.RejectInvitationRequest)

	r.NewRoute("GET", `/group/(?P<id>\d+)/feed`, controllers.GetGroupFeed)
	r.NewRoute("POST", `/group/(?P<id>\d+)/feed`, controllers.CreatePostEvent)

	r.NewRoute("POST", `/event/(?P<id>\d+)/action`, controllers.SelectEventAction)

	r.NewRoute("GET", `/ws`, websocketchat.WebSocket)
	r.NewRoute("GET", `/notifications`, controllers.GetAllNotifications)

	http.HandleFunc("/", r.ServeWithCORS(c))

	log.Println("The API is available at the link: http://localhost:8080")
	log.Println("To stop the server press `Ctrl + C`")

	log.Fatal(http.ListenAndServe(":8080", nil))
}
