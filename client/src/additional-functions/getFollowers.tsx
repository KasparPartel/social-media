import { useEffect } from "react"
import { NavigateFunction } from "react-router-dom"
import { ErrorResponse, ServerResponse, User } from "../components/models"
import { fetchErrorChecker } from "../additional-functions/fetchErr"
import { fetchHandlerNoBody } from "./fetchHandler"

interface followersProps {
    id: number
    setUserList: (userArr: User[]) => void
    setRes: (res: boolean) => void
    navigate: NavigateFunction
}

export function getFollowers({ id, setUserList, setRes, navigate }: followersProps): void {
    useEffect(() => {
        fetchHandlerNoBody(`http://localhost:8080/user/${id}/followers`, "GET")
            .then((r) => r.json())
            .then((r) => {
                if (r.errors) {
                    throw r.errors
                }

                const promiseArr: Promise<User>[] = []
                r.data.forEach((userId: number) => {
                    const user: Promise<User> = fetchHandlerNoBody(
                        `http://localhost:8080/user/${userId}`,
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
                    setRes(true)
                })
            })
            .catch((errArr: ErrorResponse[]) => {
                fetchErrorChecker(errArr, navigate)
                setRes(false)
            })
    }, [id])
}
