import { NavigateFunction } from "react-router-dom"
import { ErrorResponse } from "../components/models"

export function fetchErrorChecker(
    errArr: ErrorResponse[],
    navigate: NavigateFunction,
): ErrorResponse[] | void {
    if (errArr.length < 1) {
        navigate("/internal-error")
        return
    }

    const resErrs = errArr.filter((err) => err.code === 13 || err.code === 14)

    if (resErrs.length > 0) {
        localStorage.removeItem("id")
        navigate("/login", { state: { type: 0, data: resErrs } })
    }
    return errArr
}
