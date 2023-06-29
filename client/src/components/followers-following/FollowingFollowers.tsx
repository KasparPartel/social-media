import { Link, useNavigate } from "react-router-dom"
import { getUsersList } from "../../additional-functions/getUsers"
import { User } from "../models"
import altAvatar from "../../assets/default-avatar.png"
import "./followers-following.css"
import useParamId from "../../hooks/useParamId"

export const ProfilePlaceholders = {
    noFollowers: "No followers yet",
    noFollowings: "Not following anyone",
}

export default function FollowingFollowers() {
    const navigate = useNavigate()
    const { paramId } = useParamId()
    const followingList = getUsersList({ id: Number(paramId), navigate, endpoint: "followings" })
    const followersList = getUsersList({ id: Number(paramId), navigate, endpoint: "followers" })
    return (
        <div className="following-followers__wrapper">
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
                {userList.length === 0
                    ? placeholderPicker(header)
                    : userList.map((user, i) => {
                          return (
                              <div className="user-card" key={i}>
                                  <img
                                      className="user-card__avatar"
                                      src={user.avatar !== "" ? user.avatar : altAvatar}
                                      alt="avatar"
                                  />
                                  <Link to={`/user/${user.id}`} className="link">
                                      {user.login
                                          ? user.login
                                          : `${user.firstName} ${user.lastName}`}
                                  </Link>
                              </div>
                          )
                      })}
            </div>
        </div>
    )
}

function placeholderPicker(header: string) {
    switch (header) {
        case "Following":
            return ProfilePlaceholders.noFollowings

        case "Followers":
            return ProfilePlaceholders.noFollowers
    }
}
