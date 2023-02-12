//Additional header functions

import { Response } from "../models"
export function Logout() {
    logoutFetchHandler(`http://localhost:8080/logout`, "POST").then(
        (res: Response) => {
            if (res === null) {
                window.location.assign("/login")
            } else {
                window.location.assign("/internal-error")
                return
            }
        },
    )
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
        if (r.status == 200) return null
    })
}
