import UserPost from "./userPost"
import "./userPost.css"
import { useContext, useEffect, useState } from "react"
import { IdContext } from "../models"
import { fetchHandlerNoBody } from "../../additional-functions/fetchHandler"

export default function PostList() {
    const [idList, setIdList] = useState([])
    const [err, setErr] = useState<Error>(null)
    const userId = useContext(IdContext)

    useEffect(() => {
        const getPosts = async () => {
            fetchHandlerNoBody(`http://localhost:8080/user/${userId.id}/posts`, "GET")
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
    }, [userId.id])

    if (err) return <div>Cannot load posts - {err.message}</div>
    return (
        <section className="postList">
            {idList.map((postId, i) => (
                <UserPost postId={postId} key={i} />
            ))}
        </section>
    )
}
