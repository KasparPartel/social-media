//Additional header functions

import { Response } from "../models"
export function Logout(navigate: (path: string) => void) {
    logoutFetchHandler(`http://localhost:8080/logout`, "POST")
        .then(
            (res: Response) => {
                navigate("/login")
                return
            },
        )
    navigate("/internal-error")
}


async function logoutFetchHandler(
    inputURL: string,
    method: string,

): Promise<Response | null> {
    return fetch(inputURL, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    }).then((r) => {
        if (r.status === 200) return null
    })
}
