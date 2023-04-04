import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUsersList } from "../../additional-functions/getUsers"
import { User } from "../models"
import altAvatar from "../../assets/default-avatar.png"
import "./followers-following.css"

interface idProp {
    id: number
}

export default function FollowingFollowers({ id }: idProp) {
    const [followersList, setFollowersList] = useState<User[]>([])
    const [followingList, setFollowingList] = useState<User[]>([])
    const [res, setRes] = useState<boolean>(null)
    const navigate = useNavigate()
    getUsersList({ id, setUserList: setFollowersList, setRes, navigate, endpoint: "followers" })
    getUsersList({ id, setUserList: setFollowingList, setRes, navigate, endpoint: "followings" })
    return (
        <>
            {res === null ? null : res ? (
                <div className="test-container">
                    <FollowingFollowersContainer header="Following" userList={followingList} />
                    <FollowingFollowersContainer header="Followers" userList={followersList} />
                </div>
            ) : null}
        </>
    )
}

interface FollowingFollowersContainerProps {
    header: string
    userList: User[]
}

function FollowingFollowersContainer({ header, userList }: FollowingFollowersContainerProps) {
    return (
        <div className="following-followers">
            <div className="following-followers__header">{header}</div>
            <div className="list">
                {userList.map((user, i) => (
                    <div className="user-card" key={i}>
                        <img
                            className="user-card__avatar"
                            src={user.avatar !== "" ? user.avatar : altAvatar}
                            alt="beb"
                        />
                        {`${user.firstName} ${user.lastName}`}
                    </div>
                ))}
            </div>
        </div>
    )
}
