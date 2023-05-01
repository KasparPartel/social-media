import { useNavigate } from "react-router-dom"
import { getUsersList } from "../../additional-functions/getUsers"
import { User } from "../models"
import altAvatar from "../../assets/default-avatar.png"
import "./followers-following.css"

export default function FollowingFollowers() {
    const navigate = useNavigate()
    const id = Number(localStorage.getItem('id'))
    const followingList = getUsersList({ id, navigate, endpoint: "followings" })
    const followersList = getUsersList({ id, navigate, endpoint: "followers" })
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
