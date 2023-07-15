import LoadingSkeleton from "../../components/render-states/LoadingSkeleton"
import "./userListPage.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { User } from "../../models"
import { UserList } from "./UserList"
import { useErrorsContext } from "../../components/error-display/ErrorDisplay"
import { getUsersWithExceptionList } from "./fetch"

export function UserListPage() {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const [isLoading, setLoading] = useState(true)
    const [userList, setUserList] = useState<User[]>()

    // Getting all users except currently logged in user
    useEffect(() => {
        getUsersWithExceptionList({
            idException: Number(localStorage.getItem("id")),
            setUserList,
            setLoading,
            navigate,
            displayErrors,
        })
    }, [])

    if (isLoading) return <LoadingSkeleton dataName="list of users" />

    if (!(userList && userList.length > 0)) return <p className="empty-message">No users found</p>

    return (
        <main className="user-list-main">
            <ul className="user-list__wrapper">
                {Array.isArray(userList) && <UserList userList={userList} />}
            </ul>
        </main>
    )
}
