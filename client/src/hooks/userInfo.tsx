import { useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { fetchHandlerNoBody } from "../additional-functions/fetchHandler"
import { ErrorResponse, ServerResponse, User } from "../components/models"

/**
 * Tries to find a user with the inputted id.
 * @returns either the user or null if the user does not exist
 */
export default function useUserInfo(
    paramId: string,
    setLoading: (arg: boolean) => void,
): User | null {
    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null)

    useEffect(() => {
        fetchHandlerNoBody(`http://localhost:8080/user/${paramId}`, `GET`)
            .then((r) => r.json())
            .then((r: ServerResponse) => {
                r.errors ? fetchErrorChecker(r.errors, navigate) : setUser(r.data)
                setLoading(false)
            })
            .catch(() => fetchErrorChecker([], navigate))
    }, [paramId])

    return user
}

export function fetchErrorChecker(
    errArr: ErrorResponse[],
    navigate: NavigateFunction,
): ErrorResponse[] | void {
    if (errArr.length < 1) {
        navigate("/login", {
            state: {
                type: 0,
                data: [{ code: 0, description: "something went wrong, please relogin" }],
            },
        })
        return
    }

    const resErrs = errArr.filter((err) => {
        if (err.code === 13 || err.code === 14) return err
    })

    if (resErrs.length > 0) navigate("/login", { state: { type: 0, data: resErrs } })
    return errArr
}
