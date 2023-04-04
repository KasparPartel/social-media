import fetchHandler from "./fetchHandler"

export function Logout(navigate: (path: string) => void) {
    fetchHandler(`http://localhost:8080/logout`, "POST")
        .then((r) => {
            if (r.status === 200) {
                navigate("/login")
                return
            }
            throw new Error()
        })
        .catch(() => navigate("/internal-error"))
}
