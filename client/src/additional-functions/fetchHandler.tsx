import { FormFields } from "../components/models"

export default async function fetchHandler(
    inputURL: string,
    method: string,
    formFields?: FormFields,
): Promise<Response> {
    const request: RequestInit = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }
    if (formFields) request.body = JSON.stringify(formFields)

    return fetch(inputURL, request)
}
