import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import sendIcon from "../../assets/send-outline.svg"
import useUserInfo from "../../hooks/userInfo"
import Loading from "./render-states/loading"
import "./userPost.css"
import { PostComment } from "../models"
import { getCommentData, getCommentsIds, postComment } from "./fetch"
import { convertDateToString } from "../../additional-functions/time"

export default function CommentList({ postId }: { postId: number }) {
    const [commentsIdList, setCommentsIdList] = useState<number[]>([])
    const [inputText, setInputText] = useState("")
    const [err, setErr] = useState<Error>()
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useUserInfo(localStorage.getItem("id"))

    useEffect(() => {
        getCommentsIds(postId, setCommentsIdList, setErr, setIsLoading)
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (inputText === "") {
            return
        }

        const comment: PostComment = {
            dateOfCreation: Date.now(),
            login: user.login ?? "",
            parentId: 0,
            text: inputText,
            userId: user.id,
        }

        postComment(postId, comment, setCommentsIdList, setErr, setIsLoading)
    }

    if (err) return <div>{err.message}</div>
    if (isLoading) return <Loading color="orange" />
    return (
        <section className="post__comments">
            {commentsIdList.map((id, i) => (
                <Comment commentId={id} key={i} />
            ))}
            {user && (
                <form className="comment__form" onSubmit={(e) => handleSubmit(e)}>
                    <input
                        type="text"
                        name="addComment"
                        className="comment__input"
                        placeholder="Add a comment"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button type="submit" className="comment__btn">
                        <img src={sendIcon} alt="send" className="comment__img" />
                    </button>
                </form>
            )}
        </section>
    )
}

function Comment({ commentId }: { commentId: number }) {
    const [comment, setComment] = useState<PostComment>(null)
    const [err, setErr] = useState<Error>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getCommentData(commentId, setComment, setErr, setIsLoading)
    }, [])

    if (err) return <div>{err.message}</div>
    if (isLoading) return <Loading />
    return (
        <div className="post__comment">
            <div className="comment__user">
                <Link to={`/user/${comment.userId}`} className="comment__user__link">
                    {comment.login}
                </Link>
                <span className="comment__timestamp">
                    {convertDateToString(comment.dateOfCreation)}
                </span>
            </div>
            <p className="comment__text">{comment.text}</p>
        </div>
    )
}
