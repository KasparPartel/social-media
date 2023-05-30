import { useEffect, useState } from "react"
import useUserInfo from "../../hooks/userInfo"
import { getCommentsIds, postComment } from "./fetch"
import { PostComment } from "../models"
import Comment from "./Comment"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import sendIcon from "../../assets/send-outline.svg"
import { ErrorSkeleton } from "../render-states/ErrorSkeleton"

interface CommentListProps {
    postId: number
}

export default function CommentList({ postId }: CommentListProps) {
    const [commentsIdList, setCommentsIdList] = useState<number[] | null>(null)
    const [inputText, setInputText] = useState("")
    const [err, setErr] = useState<Error>(null)
    const [isLoading, setIsLoading] = useState(true)
    const myUser = useUserInfo(localStorage.getItem("id"))

    useEffect(() => {
        getCommentsIds(postId, setCommentsIdList, setErr, setIsLoading)
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (inputText === "") {
            console.log("comment input is empty")
            return
        }

        const comment: PostComment = {
            dateOfCreation: Date.now(),
            login: myUser.login ?? "",
            parentId: 0,
            text: inputText,
            userId: myUser.id,
        }

        postComment(postId, comment, setCommentsIdList, setErr, setIsLoading)
    }

    if (err) return <ErrorSkeleton message={err.message} />
    if (isLoading) return <LoadingSkeleton color="orange" dataName="comments" />
    return (
        <section className="post__comments">
            {commentsIdList ? (
                commentsIdList.map((id, i) => <Comment commentId={id} key={i} />)
            ) : (
                <p>No comments yet...</p>
            )}
            {myUser && (
                <form className="comment__form" onSubmit={(e) => handleSubmit(e)}>
                    <input
                        type="text"
                        name="addComment"
                        className="comment__input"
                        placeholder="Type a comment..."
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
