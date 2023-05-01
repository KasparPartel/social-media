import {
    AdditionalInfoFormFields,
    LoginFormFields,
    RegistrationFormFields,
    RequestProps,
    ServerResponse,
} from "../components/models"
import { fetchErrorChecker } from "./fetchErr"

export function formDataExtractor(
    formData: FormData,
    formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields,
) {
    formData.forEach((value, key) => {
        if (key in formFields && value) {
            formFields[key] = value
            return
        }
        delete formFields[key]
    })
}

export async function authReturnHandler(
    r: Response,
    { setErrorArr, navigate }: RequestProps,
    isRegistration: boolean,
) {
    if (r.status === 200) {
        await r
            .json()
            .then((r: ServerResponse) => {
                if (r.errors && r.errors.length != 0) {
                    const errArr = fetchErrorChecker(r.errors, navigate)
                    if (errArr) setErrorArr(errArr)
                    return
                }
                if (r.data && r.data.id) localStorage.setItem("id", String(r.data.id))
                navigate(isRegistration ? `/additional-registration` : `/user/${localStorage.getItem("id")}`)
            })
            .catch(() => navigate(`/internal-error`))
        return
    }

    throw new Error()
}
