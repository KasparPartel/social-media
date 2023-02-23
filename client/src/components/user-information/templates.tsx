import { User } from "../models"

interface publicUserProps {
    user: User
    myProfile: boolean
    height: number
    style: {
        maxHeight: string
    }
    refText: React.MutableRefObject<HTMLDivElement>
    openText: () => void
}

export function userProfile({
    user,
    myProfile,
    height,
    style,
    refText,
    openText,
}: publicUserProps) {
    return (
        <div className="test-container">
            <div className="information">
                <div className="information__short-container">
                    <div className="short-info">
                        <div className="short-info__avatar" />
                        <div className="short-info__name">
                            {`${user.firstName} ${user.lastName}`}
                        </div>
                        <button
                            className="button"
                            onClick={() => {
                                openText()
                            }}
                        >
                            {height > 0 ? "Less information ↑" : "More information ↓"}
                        </button>
                    </div>
                    {myProfile ? (
                        <button className="button">Create post</button>
                    ) : (
                        <button className="button">Follow</button>
                    )}
                </div>
                <div style={style} className="information__detailed-container">
                    <div ref={refText} className="information__detailed-info">
                        {user.email ? (
                            <label className="label">
                                Email:<p className="label__section">{user.email}</p>
                            </label>
                        ) : null}
                        {user.login ? (
                            <label className="label">
                                Username:<p className="label__section">{user.login}</p>
                            </label>
                        ) : null}
                        {user.aboutMe ? (
                            <label className="label">
                                About me:<p className="label__section">{user.aboutMe}</p>
                            </label>
                        ) : null}
                        {user.dateOfBirth ? (
                            <label className="label">
                                Birth date:
                                <p className="label__section">
                                    {new Date(user.dateOfBirth).toLocaleDateString("en-US")}
                                </p>
                            </label>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function userProfilePrivate() {
    return (
        <div className="test-container">
            <div className="information">
                <div className="information__short-container">
                    <div className="short-info">
                        <div className="short-info__name">{`This profile is private`}</div>
                    </div>
                    <button className="button">Follow</button>
                </div>
            </div>
        </div>
    )
}

export function noSuchUser() {
    return <h1>No such user</h1>
}
