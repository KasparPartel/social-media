import altAvatar from "../../assets/default-avatar.png"

interface shortInfoProps {
    firstName: string
    lastName: string
    avatar: string
    isPublic: boolean
    isMyProfile: boolean
    openText: () => void
    height: number
    followStatus: number
}

export default function ShortInfo({
    firstName,
    lastName,
    avatar,
    isPublic,
    isMyProfile,
    openText,
    height,
    followStatus,
}: shortInfoProps) {
    return (
        <div className="short-info">
            <img
                className="short-info__avatar"
                src={avatar !== "" ? avatar : altAvatar}
                alt="avatar"
            />
            <div className="short-info__name">{`${firstName} ${lastName}`}</div>
            {isPublic || isMyProfile || followStatus == 3 ? (
                <button
                    className="button"
                    onClick={() => {
                        openText()
                    }}
                >
                    {height > 0 ? "Less information ↑" : "More information ↓"}
                </button>
            ) : (
                <div className="short-info__privacy">Private profile</div>
            )}
        </div>
    )
}
