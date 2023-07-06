import { NavigateFunction } from "react-router-dom"
import { ErrorResponse } from "../components/models"
import { ErrorsDisplayType } from "../components/error-display/ErrorDisplay"

export function fetchErrorChecker(
    errArr: ErrorResponse[],
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
): ErrorResponse[] | void {
    if (errArr) {
        displayErrors(errArr)
        // navigate("/internal-error")
    }

    if (!errArr.length || errArr.length < 1) {
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
