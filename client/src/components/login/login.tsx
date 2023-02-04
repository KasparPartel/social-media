import './login.css'
import '../../constants.css'
import { ErrorResponse, IdContext } from '../models'
import { LoginRequest } from '../additional-functions/af'
import ErrorWindow from '../error-window/error-window'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'



export default function Login() {
    const navigate = useNavigate()
    const { setId } = useContext(IdContext)
    const [errorArr, setErrorArr] = useState<ErrorResponse[]>([])

    return (
        <div className='login-page'>
            <div className='cover'></div>
            <div className='login'>
                <form className='form' onSubmit={(e) => LoginRequest({ e, setErrorArr, setId, navigate })}>
                    <input
                        name='login'
                        type='text'
                        className='form__field'
                        placeholder='Login'
                    />
                    <input
                        name='password'
                        type='password'
                        className='form__field'
                        placeholder='Password'
                    />
                    <ErrorWindow errorArr={errorArr}
                    />
                    <input
                        type='submit'
                        className='form__button'
                        value='Log In'
                    />
                    <Link to='/registration'>
                        <input
                            type='button'
                            className='switch-button'
                            value='No account yet?'
                        />
                    </Link>
                </form>
            </div>
        </div>
    )
}