package sqlite

import (
	"database/sql"
	"fmt"
	"io/fs"
	"log"
	"os"
	eh "social-network/packages/errorHandler"
	"social-network/packages/models"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

type User struct {
	Id           int     `json:"id"`
	AvatarId     int     `json:"avatarId"`
	Email        string  `json:"email"`
	Login        *string `json:"login"`
	Password     string  `json:"password"`
	FirstName    string  `json:"firstName"`
	LastName     string  `json:"lastName"`
	AboutMe      string  `json:"aboutMe"`
	DateOfBirth  int     `json:"dateOfBirth"`
	FollowStatus int     `json:"followStatus"`
	IsPublic     bool    `json:"isPublic"`
}

func openDatabase() *sql.DB {
	fmt.Println("open db")
	if _, err := os.Stat("./packages/db/database"); os.IsNotExist(err) {
		err := os.Mkdir("./packages/db/database", fs.ModeDir|0755)
		eh.LogErrorFatal(err)
	}

	db, err := sql.Open("sqlite3", "./packages/db/database/social-network.db")
	eh.LogErrorFatal(err, "Failed to open database")

	db.SetMaxOpenConns(1)

	return db
}

func makeMigration() {
	fmt.Println("start migration up")
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	eh.LogErrorFatal(err)

	m, err := migrate.NewWithDatabaseInstance(
		"file://packages/db/migrations",
		"sqlite3", driver)

	eh.LogErrorFatal(err)

	err = m.Up()
	if err != migrate.ErrNoChange && err != nil {
		log.Fatal(err)
	}
}

func CreateUser(user User) (int, error) {
	sqlStmt, err := db.Prepare(`INSERT INTO users(email, password, firstName, lastName, aboutMe, dateOfBirth, isPublic)
	VALUES(?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return 0, err
	}

	ans, err := sqlStmt.Exec(user.Email, user.Password, user.FirstName, user.LastName, user.AboutMe, user.DateOfBirth, user.IsPublic)
	if err != nil {
		return 0, err
	}

	id, err := ans.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func AuthorizeUser(user User) (*User, error) {
	u := User{}

	err := db.QueryRow(`SELECT id, avatarId, email, login, password, firstName, lastName, aboutMe, dateOfBirth, isPublic FROM users WHERE login = ? OR email = ?`, user.Login, user.Login).
		Scan(&u.Id, &u.AvatarId, &u.Email, &u.Login, &u.Password, &u.FirstName, &u.LastName, &u.AboutMe, &u.DateOfBirth, &u.IsPublic)

	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(user.Password))

	if err != nil {
		return nil, err
	}

	return &u, nil
}

type followersTable struct {
	userId     int
	followerId int
	isAccepted int
}

// if isAccepted == true, then func returns 3(followed), else 2(requested)
func GetFollowStatus(userId, followerId int) (int, error) {
	q := `SELECT userId, followerId, isAccepted FROM followers WHERE userId = ? AND followerId = ?`

	tempRow := followersTable{}
	err := db.QueryRow(q, userId, followerId).Scan(&tempRow.userId, &tempRow.followerId, &tempRow.isAccepted)
	if err == sql.ErrNoRows {
		return 1, nil
	}

	if err != nil {
		return 0, err
	}

	return tempRow.isAccepted + 2, nil
}

func GetUserById(id int) (*User, error) {
	u := User{}

	err := db.QueryRow(`SELECT id, avatarId, email, login, firstName, lastName, aboutMe, dateOfBirth, isPublic FROM users WHERE id = ?`, id).
		Scan(&u.Id, &u.AvatarId, &u.Email, &u.Login, &u.FirstName, &u.LastName, &u.AboutMe, &u.DateOfBirth, &u.IsPublic)

	if err != nil {
		return nil, err
	}

	return &u, nil
}

func GetUserFollowings(id int) ([]int, error) {
	arr := make([]int, 0)

	q := `SELECT userId FROM followers WHERE followerId = ? AND isAccepted = 1`

	rows, err := db.Query(q, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	for rows.Next() {
		tempRow := followersTable{}
		err := rows.Scan(&tempRow.userId)

		if err != nil {
			return nil, err
		}

		arr = append(arr, tempRow.userId)
	}

	return arr, nil
}

func GetUserFollowers(id int) ([]int, error) {
	arr := make([]int, 0)

	q := `SELECT followerId FROM followers WHERE userId = ? AND isAccepted = 1`

	rows, err := db.Query(q, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	for rows.Next() {
		tempRow := followersTable{}
		err := rows.Scan(&tempRow.userId)

		if err != nil {
			return nil, err
		}

		arr = append(arr, tempRow.userId)
	}

	return arr, nil
}

func GetUserPosts(u *User, followerId int) ([]int, error) {
	postIds := make([]int, 0)

	q := `SELECT id,
			privacy,
			(
				SELECT count(1)
				FROM postAllows
				WHERE postId = posts.id
					AND userId = ?
			)
		FROM posts
		WHERE userId = ?`

	rows, err := db.Query(q, followerId, u.Id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	for rows.Next() {
		id, privacy, allowed := 0, 0, false
		rows.Scan(&id, &privacy, &allowed)
		if (u.Id == followerId) || (u.IsPublic && privacy == 1) ||
			(u.FollowStatus == 3 && (privacy == 1 || privacy == 2 || (privacy == 3 && allowed))) {
			postIds = append(postIds, id)
		}
	}
	return postIds, nil
}

func GetAvatar(avatarId int) (string, error) {
	avatar := ""

	err := db.QueryRow(`SELECT avatar FROM avatars WHERE id = ?`, avatarId).Scan(&avatar)
	if err != nil && err != sql.ErrNoRows {
		return "", err
	}

	return avatar, nil
}

func UpdateAvatar(avatar string, userId int) error {
	avatarId := 0
	err := db.QueryRow(`SELECT avatarId FROM users WHERE id = ?`, userId).Scan(&avatarId)
	if err != nil {
		return err
	}

	if avatarId != 0 {
		_, err = db.Exec("UPDATE avatars SET avatar = ? WHERE id = (SELECT avatarId FROM users WHERE id = ?)", avatar, userId)
		if err != nil {
			return err
		}
		return nil
	}

	res, err := db.Exec("INSERT INTO avatars (avatar) VALUES(?)", avatar)
	if err != nil {
		return err
	}

	temp, err := res.LastInsertId()
	if err != nil {
		return err
	}

	_, err = db.Exec("UPDATE users SET avatarId = ? WHERE id = ?", temp, userId)
	if err != nil {
		return err
	}

	return nil
}

func UpdateProfileColumn(columnName, value string, id int) error {
	sqlStmt, err := db.Prepare(fmt.Sprintf(`UPDATE users SET %s = ? WHERE id = ?`, columnName))
	if err != nil {
		return err
	}

	_, err = sqlStmt.Exec(value, id)
	if err != nil {
		return err
	}

	return nil
}

// return true if requested
func ChangeFollow(id, followerId int) (int, error) {
	exists := false
	var isPublic *bool

	err := db.QueryRow(`SELECT count(1), (SELECT isPublic FROM users WHERE id = ?) FROM followers WHERE userId = ? AND followerId = ?`, id, id, followerId).Scan(&exists, &isPublic)
	if err != nil || isPublic == nil {
		return 0, err
	}

	var sqlStmt *sql.Stmt

	if exists {
		sqlStmt, err = db.Prepare(`DELETE FROM followers WHERE userId = ? AND followerId = ?`)
	} else {
		sqlStmt, err = db.Prepare(`INSERT INTO followers(userId, followerId, isAccepted) VALUES(?, ?, ?)`)
	}
	if err != nil {
		return 0, err
	}

	if exists {
		_, err = sqlStmt.Exec(id, followerId)
	} else {
		_, err = sqlStmt.Exec(id, followerId, isPublic)
	}
	if err != nil {
		return 0, err
	}

	if !exists {
		if *isPublic {
			return 3, nil
		}

		return 2, nil
	}

	return 1, nil
}

func CreateUserPost(userId int, post models.CreatePostRequest) (int, int, error) {
	sqlStmt, err := db.Prepare(`INSERT INTO posts(userId, text, creationDate, privacy) VALUES(?, ?, ?, ?)`)
	if err != nil {
		return 0, 0, err
	}

	creationDate := time.Now().UnixMilli()

	result, err := sqlStmt.Exec(userId, post.Text, creationDate, post.Privacy)
	if err != nil {
		return 0, 0, err
	}

	postId, err := result.LastInsertId()
	if err != nil {
		return 0, 0, err
	}

	sqlStmt, err = db.Prepare(`INSERT INTO postAllows(postId, userId) VALUES(?, ?)`)
	if err != nil {
		return 0, 0, err
	}
	for _, id := range post.AuthorizedFollowers {
		_, err := sqlStmt.Exec(postId, id)
		if err != nil {
			return 0, 0, err
		}
	}

	sqlStmt, err = db.Prepare(`INSERT INTO postImages(postId, path) VALUES(?, ?)`)
	if err != nil {
		return 0, 0, err
	}
	for _, image := range post.Attachments {
		_, err := sqlStmt.Exec(postId, image)
		if err != nil {
			return 0, 0, err
		}
	}

	return int(postId), int(creationDate), nil
}

func GetPostById(postId, followerId int) (*models.GetPostResponse, error) {
	post := models.GetPostResponse{}
	privacy := 0
	allowed := false

	q := `SELECT id,
			userId,
			text,
			creationDate,
			privacy,
			(
				SELECT count(1)
				FROM postAllows
				WHERE postId = posts.id
					AND userId = ?
			)
		FROM posts
		WHERE id = ?;`

	err := db.QueryRow(q, followerId, postId).Scan(&post.Id, &post.UserId, &post.Text, &post.CreationDate, &privacy, &allowed)
	if err == sql.ErrNoRows {
		return nil, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}

	if err != nil {
		return nil, err
	}

	u, err := GetUserById(post.UserId)
	if err != nil {
		return nil, err
	}

	u.FollowStatus, err = GetFollowStatus(u.Id, followerId)
	if err != nil {
		return nil, err
	}

	if (u.Id != followerId) && (!u.IsPublic || privacy != 1) &&
		(u.FollowStatus != 3 || (privacy != 1 && privacy != 2 && (privacy != 3 || !allowed))) {
		return nil, eh.NewErrorResponse(eh.ErrNotFound, "wrong variable(s) in request")
	}

	post.Attachments, err = GetAttachments(post.Id)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

func GetAttachments(postId int) ([]string, error) {
	attachments := make([]string, 0)

	q := `SELECT path
		FROM postImages
		where postId = ?`

	rows, err := db.Query(q, postId)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	for rows.Next() {
		temp := ""
		rows.Scan(&temp)
		attachments = append(attachments, temp)
	}

	return attachments, nil
}

func init() {
	db = openDatabase()
	makeMigration()
}
