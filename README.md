# social-network

## Description

The project is a Facebook-like social network with features such as followers, profiles, posts, groups, notifications, and chats. It uses React as the frontend framework and Go with SQLite for the backend. Secure authentication using sessions and cookies is implemented, and real-time messaging is enabled through WebSockets. The project is containerized with Docker Compose for easy deployment.

## Usage

### Manually

1. Open the first terminal in the root of this project and navigate to the backend directory using `cd server`.
2. Start the server using `go run main.go` (the first start may take some time).
3. After a successful start of the backend, open the second terminal and navigate to the frontend directory using `cd client`.
4. Download all dependencies using `npm install`.
5. After downloading, start the development server using `npm start`.
6. Connect to [localhost:3000](http://localhost:3000).

### Using docker-compose

1. In the root of this project, use `docker-compose up` (the first download and build may take a couple of minutes).
2. After starting two services, frontend and backend, you can connect to the server at [localhost:3000](http://localhost:3000).
3. To turn off services, use `Ctrl+C`.

## Small advice for audit

- All actions with users can be performed on the `Profile` page.
- To message someone, you should use the `Users` page.
- You can create a group only on the `Groups` page.
- All requests (follow, join, invite) can be accepted or rejected on the `Notifications` page.

## Filesystem structure

```
.
├── client <- frontend
│   ├── public
│   └── src
│       ├── additional-functions
│       ├── assets
│       ├── components <- folder with all components
│       └── hooks
└── server <- backend
    ├── db
    │   ├── database <- folder with the database file
    │   └── migrations
    └── packages
        ├── controllers
        ├── errorHandler
        ├── httpRouting
        ├── models
        ├── session
        ├── sqlite
        ├── utils
        ├── validator
        └── webSocketChat
```
