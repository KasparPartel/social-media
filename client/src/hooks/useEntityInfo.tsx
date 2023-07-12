import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchErrorChecker } from "../additional-functions/fetchErr"
import fetchHandler from "../additional-functions/fetchHandler"
import { Group, ServerResponse, User } from "../components/models"
import { useErrorsContext } from "../components/error-display/ErrorDisplay"

/**
 * Tries to find a user with the inputted id.
 * @returns either the user or null if the user does not exist
 */
export default function useUserInfo(
    paramId: number,
): [User, boolean, React.Dispatch<React.SetStateAction<User>>] {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const [user, setUser] = useState<User>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetchHandler(`http://localhost:8080/user/${paramId}`, `GET`)
            .then((r) => {
                if (!r.ok) {
                    throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
                }
                return r.json()
            })
            .then((r: ServerResponse<User>) => {
                if (r.errors) throw r.errors
                setUser(r.data)
                setLoading(false)
            })
            .catch((errArr) => fetchErrorChecker(errArr, navigate, displayErrors))
    }, [paramId])

    return [user, isLoading, setUser]
}

export function useGroupInfo(
    paramId: number,
): [Group, boolean, React.Dispatch<React.SetStateAction<Group>>] {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const [group, setGroup] = useState<Group>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetchHandler(`http://localhost:8080/group/${paramId}`, `GET`)
            .then((r) => {
                if (!r.ok) {
                    throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
                }
                return r.json()
            })
            .then((r: ServerResponse<Group>) => {
                if (r.errors) throw r.errors
                setGroup(r.data)
                setLoading(false)
            })
            .catch((errArr) => fetchErrorChecker(errArr, navigate, displayErrors))
    }, [paramId])

    return [group, isLoading, setGroup]
}
