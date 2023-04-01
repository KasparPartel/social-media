import { useEffect, useState } from "react"
import { NavigateFunction } from "react-router-dom"
import { ErrorResponse, ServerResponse, User } from "../components/models"
import { fetchErrorChecker } from "../additional-functions/fetchErr"
import { fetchHandlerNoBody } from "./fetchHandler"

interface followersProps {
    userId: number
    navigate: NavigateFunction
}

export function getFollowers({ userId, navigate }: followersProps): User[] {
    const [userList, setUserList] = useState<User[]>([])

    useEffect(() => {
        fetchHandlerNoBody(`http://localhost:8080/user/${userId}/followers`, "GET")
            .then((r) => r.json())
            .then((r) => {
                if (r.errors) {
                    throw r.errors
                }

                const promiseArr: Promise<User>[] = []
                r.data.forEach((followerId: number) => {
                    const user: Promise<User> = fetchHandlerNoBody(
                        `http://localhost:8080/user/${followerId}`,
                        "GET",
                    )
                        .then((r) => r.json())
                        .then((r: ServerResponse) => {
                            if (r.errors) throw new Error()
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
    }, [userId])

    return userList
}
