import {
    AdditionalInfoFormFields,
    LoginFormFields,
    RegistrationFormFields,
    RequestProps,
    ServerResponse,
} from "../components/models"

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
    { setErrorArr, navigate }: RequestProps,
    navigatePath: string,
): Promise<ServerResponse> {
    if (r.headers.get("content-type") !== "application/json") {
        return null
    }

    await r.json().then((r: ServerResponse) => {
        if (r.errors && r.errors.length != 0) {
            setErrorArr(r.errors)
            return
        }
        if (r.data != null) {
            localStorage.setItem("id", r.data.id)
            navigate(navigatePath)
            return
        }
        throw new Error()
    })
}
