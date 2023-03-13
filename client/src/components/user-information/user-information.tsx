import moment from "moment"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { followRequest, followStatusHandler } from "../../additional-functions/follow"
import { useOpenText } from "../../hooks/openText"
import useUserId from "../../hooks/userId"
import useUserInfo from "../../hooks/userInfo"
import { labeledParagraph } from "./label"
import "./user-information.css"

export interface followProps {
    followClass: string
    followText: string
}

export function UserProfile() {
    const { paramId } = useParams()
    const isMyProfile = useUserId(paramId)
    const user = useUserInfo(paramId)
    const { height, style, refText, openText } = useOpenText(0)
    const [followPorps, setFollowPorps] = useState<followProps>(followStatusHandler(0))

    useEffect(() => {
        if (user) setFollowPorps(followStatusHandler(user.followStatus))
    }, [user])

    return (
        <>
            {user ? (
                <div className="test-container">
                    <div className="information">
                        <div className="information__short-container">
                            <div className="short-info">
                                <div className="short-info__avatar" />
                                <div className="short-info__name">
                                    {`${user.firstName} ${user.lastName}`}
                                </div>
                                {user.isPublic || isMyProfile ? (
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
                            {!isMyProfile ? (
                                <button
                                    onClick={() => followRequest(user.id, setFollowPorps)}
                                    className={"button " + followPorps.followClass}
                                >
                                    {followPorps.followText}
                                </button>
                            ) : (
                                <button className="button">Create post</button>
                            )}
                        </div>
                        <div style={style} className="information__detailed-container">
                            <div ref={refText} className="information__detailed-info">
                                {user.email ? labeledParagraph("Email", user.email) : null}
                                {user.login ? labeledParagraph("Username", user.login) : null}
                                {user.aboutMe ? labeledParagraph("About me", user.aboutMe) : null}
                                {user.dateOfBirth
                                    ? labeledParagraph(
                                          "Birth date",
                                          moment.unix(user.dateOfBirth).format("YYYY-MM-DD"),
                                      )
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h1>No such user</h1>
            )}
        </>
    )
}
