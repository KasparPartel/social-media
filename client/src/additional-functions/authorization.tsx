import {
    RegistrationFormFields,
    LoginFormFields,
    ProfileSettingsUpdateFormFields,
    RequestProps,
} from "../components/models"
import fetchHandler from "./fetchHandler"
import { formDataExtractor, authReturnHandler } from "./form"
import { updateImage } from "./images"

export function LoginRequest({ e, setErrorArr, navigate, displayErrors }: RequestProps) {
    e.preventDefault()
    const formFields: LoginFormFields = {
        login: "",
        password: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    fetchHandler(`http://localhost:8080/login`, "POST", formFields)
        .then((r) => authReturnHandler(r, { setErrorArr, navigate, displayErrors }, false))
        .catch(() => navigate("/internal-error"))
}

export function RegistrationRequest({ e, setErrorArr, navigate, displayErrors }: RequestProps) {
    e.preventDefault()
    const formFields: RegistrationFormFields = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: 0,
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)
    formFields.dateOfBirth = new Date(formFields.dateOfBirth).getTime()

    fetchHandler(`http://localhost:8080/register`, "POST", formFields)
        .then((r) => authReturnHandler(r, { setErrorArr, navigate, displayErrors }, true))
        .catch(() => navigate("/internal-error"))
}

export function AdditionalInfoRequest({
    e,
    id,
    setErrorArr,
    navigate,
    displayErrors,
    image,
}: RequestProps) {
    e.preventDefault()
    const formFields: ProfileSettingsUpdateFormFields = {
        avatar: "",
        login: "",
        aboutMe: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    updateImage(formFields, image)
        .then(() => fetchHandler(`http://localhost:8080/user/${id}`, "PUT", formFields))
        .then((r) => authReturnHandler(r, { setErrorArr, navigate, displayErrors }, false))
        .catch(() => navigate("/internal-error"))
}
