import "./login.css"
import { LoginRequest } from "../../additional-functions/authorization"
import { useNavigate } from "react-router-dom"
import { useErrorsContext } from "../../components/error-display/ErrorDisplay"

export default function Login() {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    return (
        <div className="login-page">
            <div className="cover"></div>
            <div className="login">
                <form
                    className="form"
                    onSubmit={(e) => LoginRequest({ e, navigate, displayErrors })}
                >
                    <input name="login" type="text" className="form__field" placeholder="Login" />
                    <input
                        name="password"
                        type="password"
                        className="form__field"
                        placeholder="Password"
                    />
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
