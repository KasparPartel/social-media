import { useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { fetchHandlerNoBody } from "../additional-functions/fetchHandler"
import { ErrorResponse, ServerResponse, User } from "../components/models"

export default function useUserInfo(paramId: string) {
    const [notFound, setFound] = useState(false)
    const navigate = useNavigate()
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
                    const errArr = fetchErrorChecker(r.errors, navigate)
                    if (errArr) {
                        errArr.forEach((err) => {
                            if (err.code === 16) setFound(true)
                        })
                    }
                    return
                }
                setUser(r.data)
                user.isPublic = true
            })
            .catch(() => navigate("/internal-error"))
    }, [paramId])

    return { user, notFound }
}

function fetchErrorChecker(errArr: ErrorResponse[], navigate: NavigateFunction): ErrorResponse[] | void {
    let check = false
    const resErrs = errArr.map((err) => {
        if (err.code >= 13 || err.code <= 16) {
            if (err.code === 13 || err.code === 14) check = true
            return err
        }
    })

    if (check) navigate("/login", { state: { type: 0, data: resErrs } })
    return resErrs
}
