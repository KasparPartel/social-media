import {
    AdditionalInfoFormFields,
    LoginFormFields,
    RegistrationFormFields,
    RequestProps,
    serverResponse,
} from "../models"

export function formDataExtractor(
    formData: FormData,
    formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields,
) {
    formData.forEach((value, key) => {
        if (key in formFields) {
            formFields[key] = value
        }
    })
}

export async function formReturnHandler(
    r: Response,
    { setErrorArr, setId, navigate }: RequestProps,
    navigatePath: string,
): Promise<serverResponse> {
    if (r.headers.has("content-type") && r.headers.get("content-type") === "application/json") {
        await r.json().then((r: serverResponse) => {
            if (r.errors && r.errors.length != 0) {
                setErrorArr(r.errors)
                return
            }
            if (r.data != null) {
                setId(r.data.id)
                navigate(navigatePath)
                return
            }
            throw new Error()
        })
    } else return null
}
