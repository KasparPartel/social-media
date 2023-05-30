import useUserInfo from "../../hooks/userInfo"
import altAvatar from "../../assets/default-avatar.png"

interface AvatarProps {
    userId: number
}

export default function Avatar({ userId }: AvatarProps) {
    const user = useUserInfo(userId.toString())

    return <img className="comment__avatar" src={user ? user.avatar : altAvatar} alt="avatar" />
}
