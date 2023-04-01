import { useNavigate } from "react-router-dom"
import { getFollowers } from "../../additional-functions/getFollowers"
import { User } from "../models"
import altAvatar from "../../assets/default-avatar.png"
import "./followers-following.css"

export default function FollowingFollowers() {
    const userId = Number(localStorage.getItem("id"))
    const navigate = useNavigate()
    const userList = getFollowers({ userId, navigate })

    return (
        <div className="test-container">
            <FollowingFollowersContainer header="Following" userList={userList} />
            <FollowingFollowersContainer header="Followers" userList={userList} />
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
