import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useUserInfo from "../../hooks/userInfo"
import UserPost from "./userPost"
import "./userPost.css"
import checkParamId from "../../additional-functions/userId"
import { getPostIds } from "./fetch"
import Loading from "./render-states/loading"

/*
 * Parent component for rendering posts created by specific user
 */
export default function PostList() {
    const [idList, setIdList] = useState<number[]>([])
    const [err, setErr] = useState<Error>(null)
    const { paramId } = useParams()
    const navigate = useNavigate()
    const myProfile = checkParamId(paramId)
    const { user, isLoading } = useUserInfo(paramId)

    useEffect(() => {
        if (user && user.id) {
            getPostIds(user.id, setIdList, setErr)
        }
    }, [user])

    useEffect(() => {
        if (!isLoading) {
            if (!user || (!myProfile && !user.isPublic && user.followStatus != 3)) {
                navigate(`/user/${paramId}`)
                return
            }
        }
    }, [isLoading, myProfile, user])

    if (isLoading) return <Loading />
    return UserPosts({ idList, err })
}

const UserPosts = ({ idList, err }: { idList: number[]; err: Error }) => {
    if (err) return <div>Cannot load posts - {err.message}</div>
    return (
        <section className="postList">
            {idList.map((postId, i) => (
                <UserPost postId={postId} key={i} />
            ))}
        </section>
    )
}
