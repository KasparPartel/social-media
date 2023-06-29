import { useEffect, useState } from "react"
import UserPost from "./UserPost"
import "./userPost.css"
import { getPostIds } from "./fetch"
import { User } from "../models"

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

    useEffect(() => {
        if (user && user.id) {
            getPostIds(user.id, setIdList, setErr)
        }
    }, [user])

    if (idList || err) return UserPosts({ idList, err })
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
