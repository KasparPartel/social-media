import { FormFields } from "../components/models"

export async function fetchHandler(
    inputURL: string,
    method: string,
    formFields: FormFields,
): Promise<Response> {
    return fetch(inputURL, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
    })
}

export async function fetchHandlerNoBody(inputURL: string, method: string): Promise<Response> {
    return fetch(inputURL, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })
}
