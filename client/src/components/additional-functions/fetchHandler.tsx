import { AdditionalInfoFormFields, LoginFormFields, RegistrationFormFields } from "../models"

export async function fetchHandler(
    inputURL: string,
    method: string,
    formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields = null,
): Promise<Response> {
    return fetch(inputURL, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
    })
}
