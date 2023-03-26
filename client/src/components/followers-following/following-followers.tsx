import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getFollowers } from "../../additional-functions/getFollowers"
import { User } from "../models"
import altAvatar from "../../assets/default-avatar.png"
import "./followers-following.css"
import { getFollowing } from "../../additional-functions/getFollowing"

interface idProp {
    id: number
}

export default function FollowingFollowers({ id }: idProp) {
    const [userList, setUserList] = useState<User[]>([])
    const [followingList, setFollowingList] = useState<User[]>([])
    const [res, setRes] = useState<boolean>(null)
    const navigate = useNavigate()
    getFollowers({id, setUserList, setRes, navigate})
    getFollowing({id, setFollowingList})
    return (
        <>
            {res === null ? null : res ? (
                <div className="test-container">
                    <FollowingFollowersContainer header="Following" userList={followingList} />
                    <FollowingFollowersContainer header="Followers" userList={userList} />
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
