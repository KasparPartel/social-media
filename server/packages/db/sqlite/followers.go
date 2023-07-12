package sqlite

import "database/sql"

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

// return follow status
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

func GetAllFollowers(userId int) ([]int, error) {
	rows, err := db.Query(`SELECT followerId
		FROM followers
		WHERE userId = ?
			AND isAccepted = 0`, userId)
	if err != nil {
		return nil, err
	}

	followers := make([]int, 0)

	for rows.Next() {
		followerId := 0
		err = rows.Scan(&followerId)
		if err != nil {
			return nil, err
		}

		followers = append(followers, followerId)
	}

	return followers, nil
}
