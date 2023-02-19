import "./registration.css"
import { ErrorResponse, IdContext } from "../models"
import {
    RegistrationRequest,
    AdditionalInfoRequest,
} from "../../additional-functions/authorization"
import ErrorWindow from "../error-window/error-window"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ImageUpload } from "../../additional-functions/images"

export function Registration() {
    const navigate = useNavigate()
    const { setId } = useContext(IdContext)
    const [errorArr, setErrorArr] = useState<ErrorResponse[]>([])

    return (
        <div className="registration-page">
            <div className="registration">
                <form
                    className="form"
                    onSubmit={(e) => RegistrationRequest({ e, setErrorArr, setId, navigate })}
                >
                    <input name="email" placeholder="Email" type="email" className="form__field" />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        className="form__field"
                    />
                    <input
                        name="firstName"
                        placeholder="First Name"
                        type="text"
                        className="form__field"
                    />
                    <input
                        name="lastName"
                        placeholder="Last Name"
                        type="text"
                        className="form__field"
                    />
                    <input
                        name="dateOfBirth"
                        placeholder="Birthday"
                        type="date"
                        className="form__field"
                    />
                    <ErrorWindow errorArr={errorArr} />
                    <input type="submit" className="button form__button" value="Register" />
                    <Link to="/login">
                        <input type="button" className="switch-button" value="Sign in" />
                    </Link>
                </form>
            </div>
            <div className="cover"></div>
        </div>
    )
}

export function AdditionalInfo() {
    const navigate = useNavigate()
    const { id } = useContext(IdContext)
    const [image, setImage] = useState<Blob>(null)

    useEffect(() => {
        if (id === 0) navigate("/login")
    }, [id])

    return (
        <div className="additional-info-page">
            <div className="additional-info">
                <form
                    className="form"
                    onSubmit={(e) => {
                        AdditionalInfoRequest({ e, id, navigate, image })
                    }}
                >
                    {image && (
                        <div className="form__image-container form__image-container_centered">
                            <img
                                className="form__image"
                                alt="not found"
                                src={URL.createObjectURL(image)}
                            />

                            <input
                                className="button form__button form__button_remove"
                                type="button"
                                onClick={() => setImage(null)}
                                value="Remove"
                            />
                        </div>
                    )}
                    <label className="button form__button form__button_with-label label_cursor-pointer">
                        Image upload
                        <input
                            name="avatar"
                            style={{ display: "none" }}
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => ImageUpload(e, setImage)}
                        />
                    </label>

                    <input
                        name="login"
                        placeholder="Username"
                        type="text"
                        className="form__field"
                    />

                    <input
                        name="aboutMe"
                        placeholder="About Me"
                        type="text"
                        className="form__field"
                    />
                    <div className="form__button-container">
                        <Link to="/main">
                            <input
                                type="button"
                                className="button form__button form__button_skip"
                                value="Skip"
                            />
                        </Link>

                        <input type="submit" className="button form__button" value="Finish" />
                    </div>
                </form>
            </div>
            <div className="cover"></div>
        </div>
    )
}
