import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchHandlerNoBody } from "../../additional-functions/fetchHandler"
import useUserId from "../../hooks/userId"
import useUserInfo from "../../hooks/userInfo"
import { noSuchUser, userProfilePrivate } from "../user-information/templates"

import UserPost from "./userPost"
import "./userPost.css"

export default function PostList() {
    const { paramId } = useParams()
    const myProfile = useUserId(paramId)
    const user = useUserInfo(paramId)

    const [idList, setIdList] = useState<number[]>([])
    const [err, setErr] = useState<Error>(null)

    useEffect(() => {
        if (user && user.id) {
            const getPosts = async () => {
                fetchHandlerNoBody(`http://localhost:8080/user/${user.id}/posts`, "GET")
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error(`HTTP error: status ${res.status}`)
                        }
                        return res.json()
                    })
                    .then(
                        (data) => setIdList(data),
                        (err) => setErr(err),
                    )
            }

            getPosts()
        }
    }, [user])

    if (!user) return noSuchUser()
    if (!myProfile && !user.isPublic) return userProfilePrivate()
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
