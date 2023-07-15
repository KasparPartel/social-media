import { useEffect, useState } from "react"
import UserPost from "./UserPost"
import "./userPost.css"
import { getPostIds } from "./fetch"
import { User } from "../../models"
import { useErrorsContext } from "../error-display/ErrorDisplay"
import { useNavigate } from "react-router-dom"

interface PostListParams {
    user: User
    isMyProfile: boolean
}

/*
 * Parent component for rendering posts created by specific user
 */
export default function PostList({ user, isMyProfile }: PostListParams) {
    if (!user || (!isMyProfile && !user.isPublic && user.followStatus != 3)) {
        return null
    }

    const [idList, setIdList] = useState<number[]>([])
    const [err, setErr] = useState<Error>(null)
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    useEffect(() => {
        if (user && user.id) {
            getPostIds(user.id, setIdList, setErr, navigate, displayErrors)
        }
    }, [user])

    if (idList || err) return UserPosts({ idList, err })
}

const UserPosts = ({ idList, err }: { idList: number[]; err: Error }) => {
    if (idList && idList.length != 0) {
        return (
            <section className="postList">
                {idList.map((postId, i) => (
                    <UserPost postId={postId} key={i} />
                ))}
            </section>
        )
    }
    if (err) return <div>Cannot load posts - {err.message}</div>
}
