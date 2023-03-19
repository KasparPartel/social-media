import { useState } from "react"
import { getFollowers } from "../../additional-functions/getFollowers"
import { User } from "../models"
import "./followers-following.css"

export default function FollowingFollowers() {
    const [userList, setUserList] = useState<User[]>([])
    getFollowers(2, setUserList)

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
                {userList.map((user, i) => (
                    <div className="user-card" key={i}>
                        <img className="user-card__avatar" src={user.avatar} alt="beb" />
                        {`${user.firstName} ${user.lastName}`}
                    </div>
                ))}
            </div>
        </div>
    )
}
