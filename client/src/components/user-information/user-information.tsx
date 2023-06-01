import moment from "moment"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { followStatusHandler } from "../../additional-functions/follow"
import { useOpenText } from "../../hooks/openText"
import checkParamId from "../../additional-functions/userId"
import useUserInfo from "../../hooks/userInfo"
import FollowButton from "./followButton"
import LabeledParagraph from "./label"
import ShortInfo from "./short-info"
import "./user-information.css"

export interface followProps {
    followClass: string
    followText: string
}

export function UserProfile() {
    const { paramId } = useParams()
    const { user, isLoading } = useUserInfo(paramId)
    const isMyProfile = checkParamId(paramId)
    const { height, style, refText, openText } = useOpenText(0)
    const [followPorps, setFollowPorps] = useState<followProps>(followStatusHandler(0))

    useEffect(() => {
        if (user) setFollowPorps(followStatusHandler(user.followStatus))
    }, [user])

    return (
        <>
            {isLoading ? null : user ? (
                <div className="information">
                    <div className="information__short-container">
                        <ShortInfo
                            {...{
                                user,
                                isMyProfile,
                                openText,
                                height,
                            }}
                        />
                        {!isMyProfile ? (
                            <FollowButton
                                id={user.id}
                                followPorps={followPorps}
                                setFollowPorps={setFollowPorps}
                            />
                        ) : (
                            <button className="button">Create post</button>
                        )}
                    </div>
                    <div style={style} className="information__detailed-container">
                        <div ref={refText} className="information__detailed-info">
                            <LabeledParagraph labelText="Email" insideText={user.email} />
                            <LabeledParagraph labelText="Username" insideText={user.login} />
                            <LabeledParagraph labelText="About me" insideText={user.aboutMe} />
                            <LabeledParagraph
                                labelText="Birth date"
                                insideText={moment(user.dateOfBirth).format("YYYY-MM-DD")}
                            />
                            {isMyProfile ? (
                                <LabeledParagraph
                                    labelText="Privacy"
                                    insideText={user.isPublic ? "Public" : "Private"}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : (
                <h1>No such user</h1>
            )}
        </>
    )
}
