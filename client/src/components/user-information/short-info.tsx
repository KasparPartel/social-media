interface shortInfoProps {
    firstName: string
    lastName: string
    isPublic: boolean
    isMyProfile: boolean
    openText: () => void
    height: number
}

export default function ShortInfo({
    firstName,
    lastName,
    isPublic,
    isMyProfile,
    openText,
    height,
}: shortInfoProps) {
    return (
        <div className="short-info">
            <div className="short-info__avatar" />
            <div className="short-info__name">{`${firstName} ${lastName}`}</div>
            {isPublic || isMyProfile ? (
                <button
                    className="button"
                    onClick={() => {
                        openText()
                    }}
                >
                    {height > 0 ? "Less information ↑" : "More information ↓"}
                </button>
            ) : null}
        </div>
    )
}
