import { NavigateFunction } from "react-router-dom"
import { fetchErrorChecker } from "./fetchErr"
import fetchHandler from "./fetchHandler"
import { ErrorsDisplayType } from "../components/error-display/ErrorDisplay"

export function Logout(navigate: NavigateFunction, displayErrors: ErrorsDisplayType) {
    fetchHandler(`http://localhost:8080/logout`, "POST")
        .then((r) => {
            localStorage.removeItem("id")
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
            }
            navigate("/login")
            return
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
            navigate("/internal-error")
        })
}
