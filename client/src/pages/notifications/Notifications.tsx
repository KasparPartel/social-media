import { useEffect, useState } from "react"
import fetchHandler from "../../additional-functions/fetchHandler"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { ErrorsDisplayType, useErrorsContext } from "../../components/error-display/ErrorDisplay"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { Group, ServerResponse, User } from "../../models"
import { FollowsHandler, GroupInvitesHandler, GroupJoinRequestsHandler } from "./Handlers"

interface NotificationsResponse {
    followRequest: number[]
    inviteRequest: number[]
    joinRequest: { groupId: number; userId: number }[]
}

function isGroup(r: void | User | Group): r is Group {
    r = r as Group
    return (r && r.title) !== undefined
}

export function Notifications() {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()
    const [followRequest, setFollowRequest] = useState<number[]>([])
    const [inviteRequest, setInviteRequest] = useState<Group[]>([])
    const [joinRequest, setJoinRequest] = useState<{ group: Group; userId: number }[]>([])

    useEffect(() => {
        fetchHandler(`http://localhost:8080/notifications`, "GET")
            .then((r) => {
                if (!r.ok) {
                    throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
                }
                return r.json()
            })
            .then((r: ServerResponse<NotificationsResponse>) => {
                if (r.errors) throw r.errors

                setFollowRequest(r.data.followRequest)

                r.data.inviteRequest.forEach((groupId) => {
                    fetchData(
                        `http://localhost:8080/group/${groupId}`,
                        navigate,
                        displayErrors,
                    ).then((group) => {
                        if (isGroup(group)) setInviteRequest((prev) => [...prev, group])
                    })
                })

                r.data.joinRequest.forEach(({ groupId, userId }) => {
                    fetchData(
                        `http://localhost:8080/group/${groupId}`,
                        navigate,
                        displayErrors,
                    ).then((group) => {
                        if (isGroup(group)) setJoinRequest((prev) => [...prev, { group, userId }])
                    })
                })
            })
            .catch((err) => {
                fetchErrorChecker(err, navigate, displayErrors)
            })
    }, [])

    return (
        <div className="notifications-list">
            {followRequest.length === 0 &&
            inviteRequest.length === 0 &&
            joinRequest.length === 0 ? (
                <p className="empty-message">No notifications yet</p>
            ) : null}
            {followRequest.length > 0 ? (
                <div className="user-list-main">
                    <ul className="user-list__wrapper">
                        <FollowsHandler
                            {...{
                                followRequest,
                                setFollowRequest,
                            }}
                        />
                    </ul>
                </div>
            ) : null}
            {inviteRequest.length > 0 ? (
                <div className="user-list-main">
                    <ul className="user-list__wrapper">
                        <GroupInvitesHandler
                            {...{
                                inviteRequest,
                                setInviteRequest,
                            }}
                        />
                    </ul>
                </div>
            ) : null}
            {joinRequest.length > 0 ? (
                <div className="user-list-main">
                    <ul className="user-list__wrapper">
                        <GroupJoinRequestsHandler {...{ joinRequest, setJoinRequest }} />
                    </ul>
                </div>
            ) : null}
        </div>
    )
}

function fetchData(URL: string, navigate: NavigateFunction, displayErrors: ErrorsDisplayType) {
    return fetchHandler(URL, "GET")
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r: ServerResponse<User | Group>) => {
            if (r.errors) throw r.errors
            return r.data
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
        })
}
