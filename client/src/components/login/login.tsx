import './login.css'
import { FormProps } from '../../App'

export default function Login({ view }: FormProps) {

    return (
        <div className='login-page'>
            <div className='cover'></div>
            <div className='login'>
                <form className='form'>
                    <input
                        type="text"
                        className="form__field"
                        placeholder='Login' />

                    <input
                        type="password"
                        className="form__field"
                        placeholder='Password' />

                    <input
                        type="button"
                        className="form__button"
                        value="Log In"
                        onClick={() => LoginRequest()} />
                    <input
                        type="button"
                        className="switch-button"
                        onClick={() => view(1)}
                        value="No account yet?"
                    />
                </form>
            </div>
        </div>
    )
}

function LoginRequest() {
    alert("login response")
}