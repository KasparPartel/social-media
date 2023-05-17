package sqlite

import (
	"database/sql"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

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

func GetUserById(id int) (*User, error) {
	u := User{}

	err := db.QueryRow(`SELECT id, avatarId, email, login, firstName, lastName, aboutMe, dateOfBirth, isPublic FROM users WHERE id = ?`, id).
		Scan(&u.Id, &u.AvatarId, &u.Email, &u.Login, &u.FirstName, &u.LastName, &u.AboutMe, &u.DateOfBirth, &u.IsPublic)

	if err != nil {
		return nil, err
	}

	return &u, nil
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
