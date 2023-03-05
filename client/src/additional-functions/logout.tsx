import { fetchHandlerNoBody } from "./fetchHandler"

export function Logout(navigate: (path: string) => void) {
    fetchHandlerNoBody(`http://localhost:8080/logout`, "POST")
        .then((r: Response) => {
            if (r.status === 200) {
                navigate("/login")
                return
            }
            throw new Error()
        })
        .catch(() => navigate("/internal-error"))
}
