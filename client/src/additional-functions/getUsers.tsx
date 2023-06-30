import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ErrorResponse, ServerResponse, User } from "../components/models"
import { fetchErrorChecker } from "./fetchErr"
import fetchHandler from "./fetchHandler"

interface followersProps {
    id: number
    endpoint: string
}

export function getUsersList({ id, endpoint }: followersProps): User[] {
    const navigate = useNavigate()

    const [userList, setUserList] = useState<User[]>([])

    useEffect(() => {
        fetchHandler(`http://localhost:8080/user/${id}/${endpoint}`, "GET")
            .then((r) => r.json())
            .then((r) => {
                if (r.errors) {
                    throw r.errors
                }

                const promiseArr: Promise<User>[] = []
                r.data.forEach((userId: number) => {
                    const user: Promise<User> = fetchHandler(
                        `http://localhost:8080/user/${userId}`,
                        "GET",
                    )
                        .then((r) => r.json())
                        .then((r: ServerResponse<User>) => {
                            if (r.errors) throw (r.errors)
                            return r.data
                        })
                        .catch(() => null)
                    promiseArr.push(user)
                })

                Promise.all(promiseArr).then((userArr) => {
                    userArr.filter((user) => user !== null)
                    setUserList(userArr)
                })
            })
            .catch((errArr: ErrorResponse[]) => {
                fetchErrorChecker(errArr, navigate)
            })
    }, [id])

    return userList
}
