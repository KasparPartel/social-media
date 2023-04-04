import { useNavigate } from "react-router-dom"
import { getUsersList } from "../../additional-functions/getUsers"
import { User } from "../models"
import altAvatar from "../../assets/default-avatar.png"
import "./followers-following.css"

interface idProp {
    id: number
}

export default function FollowingFollowers({ id }: idProp) {
    const navigate = useNavigate()
    const followersList = getUsersList({ userId: id, navigate, endpoint: "followers" })
    const followingList = getUsersList({ userId: id, navigate, endpoint: "followings" })
    return (
        <div className="test-container">
            <FollowingFollowersContainer header="Following" userList={followingList} />
            <FollowingFollowersContainer header="Followers" userList={followersList} />
        </div>
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
                {userList.map((user, i) => {
                    return (
                        <div className="user-card" key={i}>
                            <img
                                className="user-card__avatar"
                                src={user.avatar !== "" ? user.avatar : altAvatar}
                                alt="avatar"
                            />
                            {`${user.firstName} ${user.lastName}`}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
