import { useEffect } from "react"
import { ServerResponse, User } from "../components/models"
import { fetchHandlerNoBody } from "./fetchHandler"

export function getFollowers(id: number, setUserList: (userArr: User[]) => void): void {
    useEffect(() => {
        fetchHandlerNoBody(`http://localhost:8080/user/${id}/followers`, "GET")
            .then((r) => r.json())
            .then((r) => {
                if (r.errors) {
                    console.log(r)
                    throw new Error("error")
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
                })
            })
            .catch((r) => console.log(r))
    }, [id])
}
