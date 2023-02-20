import { useEffect, useState } from "react"
import { fetchHandlerNoBody } from "../additional-functions/fetchHandler"
import "./userPost.css"
import { Link } from "react-router-dom"

export default function Comments({ postId }: { postId: number }) {
    const [commentsIdList, setCommentsIdList] = useState<number[]>([])

    useEffect(() => {
        const getComments = async () => {
            fetchHandlerNoBody(`http://localhost:8080/post/${postId}/comments`, "GET")
                .then((res) => res.json())
                .then((data) => setCommentsIdList(data))
        }

        getComments()
    }, [])

    return (
        <section className="post__comments">
            {commentsIdList.map((id, i) => (
                <Comment id={id} key={i} />
            ))}
        </section>
    )
}

interface PostComment {
    dateOfCreation: number
    login: string
    parentId: number
    text: string
    userId: number
}

function Comment({ id }: { id: number }) {
    const [comment, setComment] = useState<PostComment>(null)
    const [err, setErr] = useState<Error>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getComment = async () => {
            fetchHandlerNoBody(`http://localhost:8080/comment/${id}`, "GET")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error: status ${res.status}`)
                    }
                    return res.json()
                })
                .then(
                    (data) => {
                        setComment(data)
                        setIsLoading(false)
                    },
                    (err) => {
                        setErr(err)
                        setIsLoading(false)
                    },
                )
        }

        getComment()
    }, [])

    const convertTimeToString = () => {
        const date = new Date(comment.dateOfCreation * 1000)
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }

    if (err) return <div>{err.message}</div>
    if (isLoading) return <div>Comment loading</div>
    return (
        <div className="post__comment">
            <div className="comment__user">
                <Link to={`#`} className="comment__user__link">
                    {comment.login}
                </Link>
                <span className="comment__timestamp">{convertTimeToString()}</span>
            </div>
            <p className="comment__text">{comment?.text}</p>
        </div>
    )
}
