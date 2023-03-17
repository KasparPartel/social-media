import { followProps } from "../components/user-information/user-information"
import { fetchHandlerNoBody } from "./fetchHandler"

export function followRequest(id: number, set) {
    // 1 - not followed, 2 - requested, 3 - followed
    fetchHandlerNoBody(`http://localhost:8080/user/${id}/followers`, "PUT")
        .then((r) => r.json())
        .then((r) => {
            if (!r.errors && r.data.followStatus) {
                set(followStatusHandler(r.data.followStatus))
            }
        })
        .catch(() => {
            throw new Error("Fetch error")
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
