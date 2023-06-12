import useUserInfo from "../../hooks/userInfo"

interface UsernameProps {
    userId: number
    commentLogin?: string
}

export default function Username({ userId, commentLogin }: UsernameProps) {
    const [user] = useUserInfo(userId.toString())

    if (!user) return <span>{commentLogin}</span>
    return (
        <span>
            {user.firstName == null || user.lastName == null
                ? user.login
                : `${user.firstName} ${user.lastName}`}
        </span>
    )
}
