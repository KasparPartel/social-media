import moment from "moment"
import { useEffect, useState } from "react"
import { followStatusHandler } from "../../additional-functions/follow"
import { useOpenText } from "../../hooks/useOpenText"
import useUserInfo from "../../hooks/useUserInfo"
import FollowButton from "./FollowButton"
import LabeledParagraph from "./Label"
import ShortInfo from "./ShortInfo"
import "./user-information.css"
import { NoSuchUser } from "./NoSuchUser"
import FollowingFollowers from "../followers-following/FollowingFollowers"
import CreatePost from "../create-post/CreatePost"
import PostList from "../user-post/PostList"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import useUserId from "../../hooks/useUserId"

export interface followProps {
    followClass: string
    followText: string
}

export function UserProfile() {
    const { paramId, isMyProfile } = useUserId()

    const [user, isLoading, setUser] = useUserInfo(paramId)
    const { height, style, refText, openText } = useOpenText(0)
    const [followPorps, setFollowPorps] = useState<followProps>(followStatusHandler(0))

    useEffect(() => {
        if (user) setFollowPorps(followStatusHandler(user.followStatus))
    }, [user])

    return (
        <>
            {isLoading ? (
                <LoadingSkeleton dataName="user profile" />
            ) : user ? (
                <>
                    <div className="information">
                        <div className="information__short-container">
                            <ShortInfo
                                {...{
                                    user,
                                    isMyProfile,
                                    openText,
                                    height,
                                    setUser,
                                }}
                            />
                            {!isMyProfile ? (
                                <FollowButton
                                    id={user.id}
                                    followPorps={followPorps}
                                    setFollowPorps={setFollowPorps}
                                />
                            ) : (
                                <CreatePost />
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
                    <div className="b">
                        <FollowingFollowers />
                        <PostList {...{ user, isMyProfile }} />
                    </div>
                </>
            ) : (
                <NoSuchUser />
            )}
        </>
    )
}
