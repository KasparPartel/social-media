import useUserInfo from "../../hooks/useUserInfo"
import altAvatar from "../../assets/default-avatar.png"

interface AvatarProps {
    userId: number
}

export default function Avatar({ userId }: AvatarProps) {
    const [user] = useUserInfo(userId)
    return (
        <img
            className="comment__avatar"
            src={!user ? null : user.avatar ? user.avatar : altAvatar}
            alt="avatar"
        />
    )
}
