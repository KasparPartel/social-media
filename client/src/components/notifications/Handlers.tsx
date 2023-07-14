import { Link } from "react-router-dom"
import { Group } from "../models"
import Username from "../post-comment/Username"
import { ReactNode } from "react"
import DeclineImg from "../../assets/VectorDecline.svg"
import AcceptImg from "../../assets/VectorAccept.svg"
import "./notifications.css"
import fetchHandler from "../../additional-functions/fetchHandler"

interface FollowsHandlerProps {
    followRequest: number[]
    setFollowRequest: React.Dispatch<React.SetStateAction<number[]>>
}

interface GroupInvitesHandlerProps {
    inviteRequest: Group[]
    setInviteRequest: React.Dispatch<React.SetStateAction<Group[]>>
}
interface GroupJoinRequestsHandlerProps {
    joinRequest: { group: Group; userId: number }[]
    setJoinRequest: React.Dispatch<
        React.SetStateAction<
            {
                group: Group
                userId: number
            }[]
        >
    >
}

export function FollowsHandler({ followRequest, setFollowRequest }: FollowsHandlerProps) {
    return (
        <>
            {followRequest.map((userId, i) => {
                return (
                    <NotificationElement
                        key={i}
                        {...{ URL: `/user/${userId}/followings/`, i, setter: setFollowRequest }}
                    >
                        <Link to={`/user/${userId}`} className="comment__user__link">
                            <Username userId={userId} />
                        </Link>
                        {` has sent you a follow request`}
                    </NotificationElement>
                )
            })}
        </>
    )
}

export function GroupInvitesHandler({ inviteRequest, setInviteRequest }: GroupInvitesHandlerProps) {
    return (
        <>
            {inviteRequest.map((group, i) => {
                return (
                    <NotificationElement
                        key={i}
                        {...{ URL: `/group/${group.id}/join/`, i, setter: setInviteRequest }}
                    >
                        {`You are invited to join the group `}
                        <Link to={`/group/${group.id}`} className="comment__user__link">
                            {group.title}
                        </Link>
                    </NotificationElement>
                )
            })}
        </>
    )
}

export function GroupJoinRequestsHandler({
    joinRequest,
    setJoinRequest,
}: GroupJoinRequestsHandlerProps) {
    return (
        <>
            {joinRequest.map(({ group, userId }, i) => {
                return (
                    <NotificationElement
                        key={i}
                        {...{
                            URL: `/group/${group.id}/invite/${userId}/`,
                            i,
                            setter: setJoinRequest,
                        }}
                    >
                        <Link to={`/user/${userId}`} className="comment__user__link">
                            <Username userId={userId} />
                        </Link>
                        {` has requested to join your group `}
                        <Link to={`/group/${group.id}`} className="comment__user__link">
                            {group.title}
                        </Link>
                    </NotificationElement>
                )
            })}
        </>
    )
}

function NotificationElement({
    children,
    URL,
    i,
    setter,
}: {
    children: ReactNode
    URL: string
    i: number
    setter: React.Dispatch<React.SetStateAction<any>>
}) {
    URL = "http://localhost:8080" + URL
    return (
        <div className="notification">
            <p className="notification__text">{children}</p>
            <div className="notification__buttons-container">
                <button
                    className="button notification__button"
                    type="button"
                    onClick={() => buttonHandler(URL + "accept", i, setter)}
                >
                    accept
                    <img src={AcceptImg} alt="avatar" />
                </button>
                <button
                    className="button notification__button"
                    type="button"
                    onClick={() => buttonHandler(URL + "reject", i, setter)}
                >
                    decline
                    <img src={DeclineImg} alt="avatar" />
                </button>
            </div>
        </div>
    )
}

function buttonHandler(URL: string, i: number, setter: React.Dispatch<React.SetStateAction<any>>) {
    fetchHandler(URL, "POST").then((r) => {
        if (r.ok) {
            setter((prev) => {
                return prev.filter((_, index) => index !== i)
            })
        }
    })
}
