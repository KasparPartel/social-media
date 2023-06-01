import {
    RegistrationFormFields,
    LoginFormFields,
    AdditionalInfoFormFields,
    RequestProps,
    ProfileSettingsUpdateFormFields,
    ProfileSettingsUpdateRequestProps,
} from "../components/models"
import fetchHandler from "./fetchHandler"
import { formDataExtractor, authReturnHandler } from "./form"
import { updateImage } from "./images"

export function LoginRequest({ e, setErrorArr, navigate }: RequestProps) {
    e.preventDefault()
    const formFields: LoginFormFields = {
        login: "",
        password: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    fetchHandler(`http://localhost:8080/login`, "POST", formFields)
        .then((r) => authReturnHandler(r, { setErrorArr, navigate }, false))
        .catch(() => navigate("/internal-error"))
}

export function RegistrationRequest({ e, setErrorArr, navigate }: RequestProps) {
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
        .then((r) => authReturnHandler(r, { setErrorArr, navigate }, true))
        .catch(() => navigate("/internal-error"))
}

export function AdditionalInfoRequest({ e, id, setErrorArr, navigate, image }: RequestProps) {
    e.preventDefault()
    const formFields: AdditionalInfoFormFields = {
        avatar: "",
        login: "",
        aboutMe: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    updateImage(formFields, image)
        .then(() => fetchHandler(`http://localhost:8080/user/${id}`, "PUT", formFields))
        .then((r) => authReturnHandler(r, { setErrorArr, navigate }, false))
        .catch(() => navigate("/internal-error"))
}

export function ProfileSettingsUpdateRequest({
    e,
    id,
    navigate,
    avatar,
}: ProfileSettingsUpdateRequestProps) {
    e.preventDefault()
    const formFields: ProfileSettingsUpdateFormFields = {
        avatar: "",
        login: "",
        aboutMe: "",
        isPublic: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    return updateImage(formFields, avatar)
        .then(() => fetchHandler(`http://localhost:8080/user/${id}`, "PUT", formFields))
        .then((r) => r.json())
        .then((r) => {
            if (r.errors === null) return null
            return r.errors
        })
        .catch(() => navigate("/internal-error"))
}
