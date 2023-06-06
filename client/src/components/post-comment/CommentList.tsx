import { useEffect, useState } from "react"
import useUserInfo from "../../hooks/userInfo"
import { getCommentsIds } from "./fetch"
import Comment from "./Comment"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import { ErrorSkeleton } from "../render-states/ErrorSkeleton"
import AddComment from "./AddComment"

interface CommentListProps {
    postId: number
}

export default function CommentList({ postId }: CommentListProps) {
    const [commentsIdList, setCommentsIdList] = useState<number[]>(null)
    const [err, setErr] = useState<Error>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user: myUser } = useUserInfo(localStorage.getItem("id"))

    useEffect(() => {
        const fetchCommentIds = async () => {
            try {
                const response = await getCommentsIds(postId)
                setCommentsIdList(response.data)
            } catch (e) {
                setErr(e as Error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCommentIds()
    }, [])

    if (err) return <ErrorSkeleton message={err.message} />
    if (isLoading) return <LoadingSkeleton color="orange" dataName="comments" />
    return (
        <section className="post__comments">
            {commentsIdList && commentsIdList.length > 0 ? (
                commentsIdList.map((id, i) => <Comment commentId={id} key={id} />)
            ) : (
                <p>No comments yet...</p>
            )}
            {myUser && (
                <AddComment postId={postId} myUser={myUser} setCommentsIdList={setCommentsIdList} />
            )}
        </section>
    )
}
