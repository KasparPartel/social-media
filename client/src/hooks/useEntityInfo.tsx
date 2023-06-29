import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchErrorChecker } from "../additional-functions/fetchErr"
import fetchHandler from "../additional-functions/fetchHandler"
import { Group, ServerResponse, User } from "../components/models"

/**
 * Tries to find a user with the inputted id.
 * @returns either the user or null if the user does not exist
 */
export default function useUserInfo(
    paramId: number,
): [User, boolean, React.Dispatch<React.SetStateAction<User>>] {
    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetchHandler(`http://localhost:8080/user/${paramId}`, `GET`)
            .then((r) => r.json())
            .then((r: ServerResponse<User>) => {
                r.errors ? fetchErrorChecker(r.errors, navigate) : setUser(r.data)
                setLoading(false)
            })
            .catch(() => fetchErrorChecker([], navigate))
    }, [paramId])

    return [user, isLoading, setUser]
}

export function useGroupInfo(
    paramId: number,
): [Group, boolean, React.Dispatch<React.SetStateAction<Group>>] {
    const navigate = useNavigate()
    const [group, setGroup] = useState<Group>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetchHandler(`http://localhost:8080/group/${paramId}`, `GET`)
            .then((r) => r.json())
            .then((r: ServerResponse<Group>) => {
                r.errors ? fetchErrorChecker(r.errors, navigate) : setGroup(r.data)
                setLoading(false)
            })
            .catch(() => fetchErrorChecker([], navigate))
    }, [paramId])

    return [group, isLoading, setGroup]
}
