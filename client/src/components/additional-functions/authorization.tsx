import {
    RegistrationFormFields,
    LoginFormFields,
    AdditionalInfoFormFields,
    RequestProps,
} from "../models"
import { fetchHandler } from "./fetchHandler"
import { formDataExtractor, formReturnHandler } from "./form"
import { updateImage } from "./images"

export function LoginRequest({ e, setErrorArr, setId, navigate }: RequestProps) {
    e.preventDefault()
    const formFields: LoginFormFields = {
        login: "",
        password: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    fetchHandler(`http://localhost:8080/login`, "POST", formFields)
        .then((r) => formReturnHandler(r, { e, setErrorArr, setId, navigate }, "/main"))
        .catch(() => navigate("/internal-error"))
}

export function RegistrationRequest({ e, setErrorArr, setId, navigate }: RequestProps) {
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
        .then((r) =>
            formReturnHandler(r, { e, setErrorArr, setId, navigate }, "/additional-registration"),
        )
        .catch(() => navigate("/internal-error"))
}

export function AdditionalInfoRequest({ e, id, navigate, image }: RequestProps) {
    e.preventDefault()
    const formFields: AdditionalInfoFormFields = {
        avatar: "",
        login: "",
        aboutMe: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    updateImage(formFields, image)
        .then(() => fetchHandler(`http://localhost:8080/user/${id}`, "PUT", formFields))
        .then((r: Response) => {
            if (r.status === 200) {
                navigate("/main")
                return
            }
            throw new Error()
        })
        .catch(() => navigate("/internal-error"))
}
