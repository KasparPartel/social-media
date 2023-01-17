import './registration.css'
import { useState } from 'react';
import { FormProps } from '../../App'

export function Registration({ view }: FormProps) {

    return (
        <div className='registration-page'>
            <div className='registration'>
                <form className='form'>
                    <input
                        placeholder="Email"
                        type="email"
                        className="form__field" />

                    <input
                        placeholder="Password"
                        type="password"
                        className="form__field" />

                    <input
                        placeholder="First Name"
                        type="text"
                        className="form__field" />

                    <input
                        placeholder="Last Name"
                        type="text"
                        className="form__field" />

                    <input
                        placeholder="Birthday"
                        type="date"
                        className="form__field" />

                    <input
                        type="button"
                        className="form__button"
                        value="Register"
                        onClick={() => RegistrationRequest(view)} />
                    <input
                        type="button"
                        className="switch-button"
                        onClick={() => view(0)}
                        value="Sign in"
                    />
                </form>
            </div>
            <div className='cover'></div>
        </div>
    )
}

export function AdditionalInfo() {
    const [image, setImage] = useState(null);

    return (
        <div className='additional-info-page'>
            <div className='additional-info'>
                <form className='form'>
                    {image &&
                        (<div className='form__image-container form__image-container_centered'>
                            <img
                                className='form__image'
                                alt="not found"
                                src={URL.createObjectURL(image)} />

                            <input
                                className='form__button form__button_remove'
                                type="button"
                                onClick={() => setImage(null)}
                                value="Remove"
                            />
                        </div>)}

                    <label className='form__button form__button_with-label label_cursor-pointer '>
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            onChange={(e) => ImageUpload(e, setImage)}
                        />
                        Image upload
                    </label>

                    <input
                        placeholder="Username"
                        type="text"
                        className="form__field"
                    />

                    <input
                        placeholder="About Me"
                        type="text"
                        className="form__field"
                    />

                    <div className="form__button-container">
                        <input
                            type="button"
                            className='form__button form__button_skip'
                            value="Skip"
                            onClick={() => SkipToMainPage()}
                        />

                        <input
                            type="button"
                            className='form__button'
                            value="Finish"
                            onClick={() => AdditionalInfoRequest()}
                        />
                    </div>
                </form>
            </div>
            <div className='cover'></div>
        </div >
    )
}

function RegistrationRequest(view: FormProps["view"]) {
    alert("Registration response")
    view(2)
}

function SkipToMainPage() {
    alert("main page")
}

function AdditionalInfoRequest() {
    alert("Additional info request")
}

function ImageUpload(e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<any>) {
    if (!e.target.files) return
    setImage(e.target.files[0])
}