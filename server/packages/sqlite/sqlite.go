package sqlite

import (
	"database/sql"
	"fmt"
	"io/fs"
	"log"
	"os"
	eh "social-network/packages/errorHandler"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
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
	if _, err := os.Stat("./db/database"); os.IsNotExist(err) {
		err := os.MkdirAll("./db/database", fs.ModeDir|0755)
		eh.LogErrorFatal(err)
	}

	db, err := sql.Open("sqlite3", "./db/database/social-network.db")
	eh.LogErrorFatal(err, "Failed to open database")

	db.SetMaxOpenConns(1)

	return db
}

func makeMigration() {
	fmt.Println("start migration up")
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	eh.LogErrorFatal(err)

	m, err := migrate.NewWithDatabaseInstance(
		"file://db/migrations",
		"sqlite3", driver)

	eh.LogErrorFatal(err)

	err = m.Up()
	if err != migrate.ErrNoChange && err != nil {
		log.Fatal(err)
	}

	version, _, err := m.Version()
	if err != migrate.ErrNilVersion && err != nil {
		log.Fatal(err)
	}

	log.Printf("Current database version is %d", version)
}

func init() {
	db = openDatabase()
	makeMigration()
}
