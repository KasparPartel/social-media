import "./registration.css"
import {
    RegistrationRequest,
    AdditionalInfoRequest,
} from "../../additional-functions/authorization"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImageUpload } from "../../additional-functions/images"
import { useErrorsContext } from "../../components/error-display/ErrorDisplay"

export function Registration() {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    return (
        <div className="registration-page">
            <div className="registration">
                <form
                    className="form"
                    onSubmit={(e) => RegistrationRequest({ e, navigate, displayErrors })}
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
                    <input type="submit" className="button form__button" value="Register" />
                    <input
                        type="button"
                        className="switch-button"
                        onClick={() => navigate("/login")}
                        value="Sign in"
                    />
                </form>
            </div>
            <div className="cover" />
        </div>
    )
}

export function AdditionalInfo() {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const [image, setImage] = useState<Blob>(null)

    return (
        <div className="additional-info-page">
            <div className="additional-info">
                <form
                    className="form"
                    onSubmit={(e) => {
                        AdditionalInfoRequest({
                            e,
                            id: localStorage.getItem("id"),
                            navigate,
                            displayErrors,
                            image,
                        })
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
                    <label className="button form__button form__button_with-label">
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
                        <input
                            type="button"
                            className="button form__button form__button_skip"
                            onClick={() => navigate(`/user/${localStorage.getItem("id")}`)}
                            value="Skip"
                        />
                        <input type="submit" className="button form__button" value="Finish" />
                    </div>
                </form>
            </div>
            <div className="cover"></div>
        </div>
    )
}
