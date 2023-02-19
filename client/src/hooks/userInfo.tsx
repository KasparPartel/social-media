import { useEffect, useState } from "react"
import { fetchHandlerNoBody } from "../additional-functions/fetchHandler"
import { ErrorResponse, ServerResponse, User } from "../components/models"

export default function useUserInfo(paramId: string) {
    const [user, setUser] = useState<User>({
        avatar: "",
        email: "",
        login: "",
        firstName: "",
        lastName: "",
        aboutMe: "",
        dateOfBirth: 0,
        isPublic: false,
    })

    useEffect(() => {
        fetchHandlerNoBody(`http://localhost:8080/user/${paramId}`, `GET`)
            .then((r) => r.json())
            .then((r: ServerResponse) => {
                if (r.errors) {
                    checkErrors(r.errors)
                    return
                }
                setUser(r.data)
            })
    }, [paramId])

    return { user }
}

function checkErrors(err: ErrorResponse[]) {
    err.map((v) => {
        console.log(v)
    })
}
