import { fetchHandlerNoBody } from "./fetchHandler"

export function followRequest(id) {
    console.log(id)
    fetchHandlerNoBody(`http://localhost:8080/user/${id}/followers`, "PUT")
        .then((r) => r.json())
        .then((r) => console.log(r))
}
