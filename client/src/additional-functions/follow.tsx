import { NavigateFunction } from "react-router-dom"
import { followProps } from "../components/user-information/UserInformation"
import { fetchErrorChecker } from "./fetchErr"
import fetchHandler from "./fetchHandler"
import { ErrorsDisplayType } from "../components/error-display/ErrorDisplay"

export function followRequest(
    id: number,
    set: (arg: followProps) => void,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
) {
    // 1 - not followed, 2 - requested, 3 - followed
    fetchHandler(`http://localhost:8080/user/${id}/followers`, "PUT")
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: status ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r) => {
            if (r.errors) throw r.errors
            if (r.data.followStatus) {
                set(followStatusHandler(r.data.followStatus))
            }
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
        })
}

export function followStatusHandler(status: number): followProps {
    switch (status) {
        case 1:
            return {
                followClass: "button_follow-status_not-following",
                followText: "Follow",
            }
        case 2:
            return {
                followClass: "button_follow-status_requested",
                followText: "Requested",
            }
        case 3:
            return {
                followClass: "button_follow-status_following",
                followText: "Unfollow",
            }
        default:
            return {
                followClass: "button_follow-status_unknown",
                followText: "Unknown status",
            }
    }
}
