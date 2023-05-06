import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchErrorChecker } from "../additional-functions/fetchErr"
import fetchHandler from "../additional-functions/fetchHandler"
import { ServerResponse, User } from "../components/models"

/**
 * Tries to find a user with the inputted id.
 * @returns either the user or null if the user does not exist
 */
export default function useUserInfo(
    paramId: string,
    setLoading?: (arg: boolean) => void,
): User | null {
    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null)

    useEffect(() => {
        fetchHandler(`http://localhost:8080/user/${paramId}`, `GET`)
            .then((r) => r.json())
            .then((r: ServerResponse) => {
                r.errors ? fetchErrorChecker(r.errors, navigate) : setUser(r.data)
                if (setLoading) setLoading(false)
            })
            .catch(() => fetchErrorChecker([], navigate))
    }, [paramId])

    return user
}
