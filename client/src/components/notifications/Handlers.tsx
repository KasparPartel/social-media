import { Link } from "react-router-dom"
import { Group } from "../models"
import Username from "../post-comment/Username"
import { ReactNode } from "react"
import DeclineImg from "../../assets/VectorDecline.svg"
import AcceptImg from "../../assets/VectorAccept.svg"
import "./notifications.css"

export function FollowsHandler({ followRequest }: { followRequest: number[] }) {
    return (
        <>
            {followRequest.map((userId, i) => {
                return (
                    <NotificationElement key={i}>
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

export function GroupInvitesHandler({ inviteRequest }: { inviteRequest: Group[] }) {
    return (
        <>
            {inviteRequest.map((group, i) => {
                return (
                    <NotificationElement key={i}>
                        {`You are invited to join the group`}
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
}: {
    joinRequest: { group: Group; userId: number }[]
}) {
    return (
        <>
            {joinRequest.map(({ group, userId }, i) => {
                return (
                    <NotificationElement key={i}>
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

function NotificationElement({ children }: { children: ReactNode }) {
    return (
        <div className="notification">
            <p className="notification__text">{children}</p>
            <div className="notification__buttons-container">
                <button
                    className="button notification__button"
                    type="button"
                    onClick={() => buttonHandler()}
                >
                    accept
                    <img src={DeclineImg} alt="avatar" />
                </button>
                <button
                    className="button notification__button"
                    type="button"
                    onClick={() => buttonHandler()}
                >
                    decline
                    <img src={AcceptImg} alt="avatar" />
                </button>
            </div>
        </div>
    )
}

function buttonHandler() {
    console.log("click")
}
