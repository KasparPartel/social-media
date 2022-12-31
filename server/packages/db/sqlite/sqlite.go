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
)

var db *sql.DB

type User struct {
	UUID        string
	Id          int    `json:"id"`
	Email       string `json:"email"`
	Login       string `json:"login"`
	Password    string `json:"password"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	AboutMe     string `json:"aboutMe"`
	DateOfBirth int    `json:"dateOfBirth"`
	IsPublic    bool   `json:"isPublic"`
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
	sqlStmt, err := db.Prepare(`INSERT INTO users(uuid, email, login, password, firstName, lastName, aboutMe, dateOfBirth, isPublic)
	VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return 0, err
	}

	ans, err := sqlStmt.Exec(user.UUID, user.Email, user.Login, user.Password, user.FirstName, user.LastName, user.AboutMe, user.DateOfBirth, user.IsPublic)
	if err != nil {
		return 0, err
	}

	id, err := ans.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func init() {
	db = openDatabase()
	makeMigration()
}
