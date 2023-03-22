import {
    RegistrationFormFields,
    LoginFormFields,
    AdditionalInfoFormFields,
    Response,
    RequestProps,
    PostFormFields,
} from "../models"

export function ImageUpload(e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<any>) {
    if (!e.target.files) return
    setImage(e.target.files[0])
}

export function formDataExtractor(
    formData: FormData,
    formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields | PostFormFields,
    attachments?: { name: string; value: string }[] | string,
) {
    formData.forEach((value, key) => {
        if (key in formFields) {
            switch (key) {
                case "avatar":
                    if (typeof attachments === "string") formFields[key] = attachments
                    break
                case "attachments":
                    if (Array.isArray(attachments))
                        formFields[key] = attachments.map((attachment) => attachment.value)
                    break
                default:
                    formFields[key] = value
                    break
            }
        }
    })
}

export function LoginRequest({ e, setErrorArr, setId, navigate }: RequestProps) {
    e.preventDefault()

    const formFields: LoginFormFields = {
        login: "",
        password: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    formFetchHandler(`http://localhost:8080/login`, "POST", formFields).then(
        (response: Response) => {
            if (response.errors && response.errors.length != 0) {
                setErrorArr(response.errors)
                return
            }
            if (response.data === null) {
                navigate("/internal-error")
                return
            }
            setId(response.data.id)
            navigate("/main")
        },
    )
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

    formFetchHandler(`http://localhost:8080/register`, "POST", formFields).then(
        (response: Response) => {
            if (response.errors && response.errors.length != 0) {
                setErrorArr(response.errors)
                return
            }
            if (response.data === null) {
                navigate("/internal-error")
                return
            }
            setId(response.data.id)
            navigate("/additional-registration")
        },
    )
}

export function AdditionalInfoRequest({ e, id, navigate, image }: RequestProps) {
    e.preventDefault()
    const formFields: AdditionalInfoFormFields = {
        avatar: "",
        login: "",
        aboutMe: "",
    }

    toBase64(image).then((r) => {
        formDataExtractor(new FormData(e.currentTarget), formFields, r)
        formFetchHandler(`http://localhost:8080/user/${id}`, "PUT", formFields)
            .then((response) => {
                if (response === null) navigate("/main")
            })
            .catch(() => navigate("/internal-error"))
    })
}

export async function toBase64(file: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result?.toString() || "")
        reader.onerror = (error) => reject(error)
    })
}

async function formFetchHandler(
    inputURL: string,
    method: string,
    formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields,
): Promise<Response | null> {
    return fetch(inputURL, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
    }).then((r) => {
        if (r.headers.has("content-type") && r.headers.get("content-type") === "application/json") {
            return r.json()
        } else return null
    })
}
