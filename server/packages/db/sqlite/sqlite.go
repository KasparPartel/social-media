package sqlite

import (
	"database/sql"
	"fmt"
	"io/fs"
	"log"
	"os"
	"social-network/packages/errorHandler"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

type User struct {
	Id          int     `json:"id"`
	AvatarId    int     `json:"avatarId"`
	Email       string  `json:"email"`
	Login       *string `json:"login"`
	Password    string  `json:"password"`
	FirstName   string  `json:"firstName"`
	LastName    string  `json:"lastName"`
	AboutMe     string  `json:"aboutMe"`
	DateOfBirth int     `json:"dateOfBirth"`
	IsPublic    bool    `json:"isPublic"`
}

func openDatabase() *sql.DB {
	fmt.Println("open db")
	if _, err := os.Stat("./packages/db/database"); os.IsNotExist(err) {
		err := os.Mkdir("./packages/db/database", fs.ModeDir|0755)
		errorHandler.LogErrorFatal(err)
	}

	db, err := sql.Open("sqlite3", "./packages/db/database/social-network.db")
	errorHandler.LogErrorFatal(err, "Failed to open database")

	db.SetMaxOpenConns(1)

	return db
}

func makeMigration() {
	fmt.Println("start migration up")
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	errorHandler.LogErrorFatal(err)

	m, err := migrate.NewWithDatabaseInstance(
		"file://packages/db/migrations",
		"sqlite3", driver)

	errorHandler.LogErrorFatal(err)

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
	isAccepted bool
}

func IsFollower(userId, followerId int) (bool, error) {
	q := `SELECT userId, followerId FROM followers WHERE userId = ? AND followerId = ?`

	tempRow := followersTable{}
	err := db.QueryRow(q, userId, followerId).Scan(&tempRow.userId, &tempRow.followerId)
	if err == sql.ErrNoRows {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func GetId(uuid string) (int, error) {
	id := 0
	q := `SELECT id FROM users WHERE uuid = ?`

	err := db.QueryRow(q, uuid).Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func GetUserById(id int) (*User, error) {
	u := User{}

	err := db.QueryRow(`SELECT id, avatarId, email, login, password, firstName, lastName, aboutMe, dateOfBirth, isPublic FROM users WHERE id = ?`, id).
		Scan(&u.Id, &u.AvatarId, &u.Email, &u.Login, &u.Password, &u.FirstName, &u.LastName, &u.AboutMe, &u.DateOfBirth, &u.IsPublic)

	if err != nil {
		return nil, err
	}

	return &u, nil
}

func GetFollowings(id int) ([]int, error) {
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

func GetAvatar(avatarId int) (string, error) {
	avatar := ""

	err := db.QueryRow(`SELECT avatar FROM avatars WHERE id = ?`, avatarId).Scan(&avatar)
	if err != nil && err != sql.ErrNoRows {
		return "", err
	}

	return avatar, nil
}

func UpdateAvatar(avatar string, id int) error {
	sqlStmt, err := db.Prepare("UPDATE avatars SET avatar = ? WHERE id = (SELECT avatarId FROM users WHERE id = ?)")
	if err != nil {
		return err
	}

	_, err = sqlStmt.Exec(avatar, id)
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

func init() {
	db = openDatabase()
	makeMigration()
}
