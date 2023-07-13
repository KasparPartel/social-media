import altAvatar from "../../assets/default-avatar.png"
import { User } from "../models"
import "./userList.css"
import { useNavigate } from "react-router-dom"

const followStatuses = {
    1: "NOT FOLLOWED",
    2: "REQUESTED",
    3: "FOLLOWED",
}

type UserListProps = {
    userList: User[]
}

export function UserList({ userList }: UserListProps) {
    const navigate = useNavigate()

    return (
        <>
            {userList.map((user, key) => {
                return (
                    <li
                        className="user-list__item"
                        key={key}
                        onClick={(e) => {
                            e.preventDefault()
                            navigate(`/user/${user.id}`)
                        }}
                    >
                        <AvatarSection src={user.avatar} alt="avatar" />
                        <UserInfoSection
                            username={user.login}
                            name={`${user.firstName} ${user.lastName}`}
                            followStatus={followStatuses[user.followStatus]}
                        />
                    </li>
                )
            })}
        </>
    )
}

type AvatarProps = {
    src: string
    alt: string
    width?: number
    height?: number
}

const AvatarSection = ({ src, alt, width, height }: AvatarProps) => {
    return (
        <div className="avatar-section">
            {src !== "" ? (
                <img className="avatar-section__image" src={src} alt={alt} />
            ) : (
                <img className="avatar-section__image" src={altAvatar} alt="default avatar" />
            )}
        </div>
    )
}

type UserInfoSectionProps = {
    username: string
    name: string
    followStatus: string
}

const UserInfoSection = ({ username, name, followStatus }: UserInfoSectionProps) => {
    return (
        <div className="info_section">
            <div className="info_section__name">
                {name} {username === null ? "" : `(${username})`}
            </div>
            <div className="info_section__follow-status">{followStatus}</div>
        </div>
    )
}
