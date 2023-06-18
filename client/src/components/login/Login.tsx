import "./login.css"
import { ErrorResponse } from "../models"
import { LoginRequest } from "../../additional-functions/authorization"
import ErrorWindow from "../error-window/ErrorWindow"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Login() {
    const navigate = useNavigate()
    const [errorArr, setErrorArr] = useState<ErrorResponse[]>([])
    const { state } = useLocation()
    if (state)
        useEffect(() => {
            if (state.type === 0 && state.data) {
                setErrorArr(state.data)
            }
        }, [state])

    return (
        <div className="login-page">
            <div className="cover"></div>
            <div className="login">
                <form className="form" onSubmit={(e) => LoginRequest({ e, setErrorArr, navigate })}>
                    <input name="login" type="text" className="form__field" placeholder="Login" />
                    <input
                        name="password"
                        type="password"
                        className="form__field"
                        placeholder="Password"
                    />
                    <ErrorWindow errorArr={errorArr} />
                    <input type="submit" className="button form__button" value="Log In" />
                    <input
                        type="button"
                        className="switch-button"
                        onClick={() => navigate("/registration")}
                        value="No account yet?"
                    />
                </form>
            </div>
        </div>
    )
}
