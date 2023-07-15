import moment from "moment"
import { useEffect, useState } from "react"
import { followStatusHandler } from "../../additional-functions/follow"
import { useOpenText } from "../../hooks/useOpenText"
import useUserInfo from "../../hooks/useEntityInfo"
import FollowButton from "./FollowButton"
import LabeledParagraph from "./Label"
import ShortInfo from "./ShortInfo"
import "./user-information.css"
import FollowingFollowers from "../../components/followers-following/FollowingFollowers"
import CreatePost from "../../components/create-post/CreatePost"
import PostList from "../../components/user-post/PostList"
import LoadingSkeleton from "../../components/render-states/LoadingSkeleton"
import useParamId from "../../hooks/useParamId"
import { useNavigate } from "react-router-dom"
import { Chat } from "../../components/chat-component/Chat"

export interface followProps {
    followClass: string
    followText: string
}

export function UserProfile() {
    const navigate = useNavigate()
    const { paramId, isMyProfile } = useParamId()

    const [user, isLoading, setUser] = useUserInfo(paramId)
    const { height, style, refText, openText } = useOpenText(0)
    const [followProps, setFollowProps] = useState<followProps>(followStatusHandler(0))

    useEffect(() => {
        if (user && user.followStatus !== 0) setFollowProps(followStatusHandler(user.followStatus))
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
                            <div className="information__buttons">
                                {!isMyProfile && user.followStatus === 3 ? (
                                    <Chat {...{ id: user.id, isGroup: false }} />
                                ) : null}
                                {!isMyProfile ? (
                                    <FollowButton
                                        id={user.id}
                                        followPorps={followProps}
                                        setFollowPorps={setFollowProps}
                                    />
                                ) : (
                                    <CreatePost />
                                )}
                            </div>
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
                    {isMyProfile || user.isPublic || user.followStatus === 3 ? (
                        <div className="b">
                            <FollowingFollowers />
                            <PostList {...{ user, isMyProfile }} />
                        </div>
                    ) : null}
                </>
            ) : (
                navigate("/error-not-found")
            )}
        </>
    )
}
