import { NavigateFunction } from "react-router-dom"
import { ErrorResponse } from "../components/models"

export function fetchErrorChecker(
    errArr: ErrorResponse[],
    navigate: NavigateFunction,
): ErrorResponse[] | void {
    if (errArr.length < 1) {
        navigate("/login", {
            state: {
                type: 0,
                data: [{ code: 0, description: "something went wrong, please relogin" }],
            },
        })
        return
    }

    const resErrs = errArr.filter((err) => err.code === 13 || err.code === 14)

    if (resErrs.length > 0) navigate("/login", { state: { type: 0, data: resErrs } })
    return errArr
}
