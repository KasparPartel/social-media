import { NavigateFunction } from "react-router-dom"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import fetchHandler from "../../additional-functions/fetchHandler"
import { User } from "../../models"
import { ErrorsDisplayType } from "../../components/error-display/ErrorDisplay"

type GetUsersProps = {
    idException: number
    setUserList: React.Dispatch<React.SetStateAction<User[]>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    navigate: NavigateFunction
    displayErrors: ErrorsDisplayType
}

export function getUsersWithExceptionList({
    idException,
    setUserList,
    setLoading,
    navigate,
    displayErrors,
}: GetUsersProps) {
    fetchHandler(`http://localhost:8080/users`, "GET")
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r) => {
            if (r.errors) throw r.errors

            const promiseArr: Promise<User | null>[] = []
            r.data.forEach((userId: number) => {
                if (userId === idException) return
                const user: Promise<User | null> = fetchHandler(
                    `http://localhost:8080/user/${userId}`,
                    "GET",
                )
                    .then((r) => {
                        if (!r.ok)
                            throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
                        return r.json()
                    })
                    .then((r) => {
                        if (r.errors) throw r.errors
                        return r.data
                    })
                    .catch((errArr) => {
                        fetchErrorChecker(errArr, navigate, displayErrors)
                        return null
                    })
                promiseArr.push(user)
            })

            Promise.all(promiseArr).then((userArr) => {
                userArr.filter((user) => user !== null)
                setUserList(userArr)
                setLoading(false)
            })
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
        })
}
