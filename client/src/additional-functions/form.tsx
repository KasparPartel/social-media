import { FormFields, RequestProps, ServerResponse, User } from "../components/models"
import { fetchErrorChecker } from "./fetchErr"

export function formDataExtractor(formData: FormData, formFields: FormFields) {
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
    { setErrorArr, navigate, displayErrors }: RequestProps,
    isRegistration: boolean,
) {
    if (!r.ok) {
        throw [{ code: r.status, description: `HTTP error: status ${r.statusText}` }]
    }
    await r.json()
        .then((r: ServerResponse<User>) => {
            if (r.errors) {
                const errArr = fetchErrorChecker(r.errors, navigate, displayErrors)
                if (errArr) setErrorArr(errArr)
                throw r.errors
            }
            if (r.data && r.data.id) localStorage.setItem("id", String(r.data.id))
            navigate(
                isRegistration
                    ? `/additional-registration`
                    : `/user/${localStorage.getItem("id")}`,
            )
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
            // navigate(`/internal-error`)
        })
}