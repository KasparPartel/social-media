import './login.css'
import '../../constants.css'
import { ErrorResponse, IdContext, FormProps } from '../models'
import { LoginRequest } from '../additional-functions/af'
import ErrorWindow from '../error-window/error-window'
import { useContext, useState } from 'react'



export default function Login({ setViewExtention }: FormProps) {
    const { setId } = useContext(IdContext)
    const [errorArr, setErrorArr] = useState<ErrorResponse[]>([])

    return (
        <div className='login-page'>
            <div className='cover'></div>
            <div className='login'>
                <form className='form' onSubmit={(e) => LoginRequest(e, setErrorArr, setId)}>
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
                    <input
                        type='button'
                        className='switch-button'
                        onClick={() => setViewExtention(1)}
                        value='No account yet?'
                    />
                </form>
            </div>
        </div>
    )
}