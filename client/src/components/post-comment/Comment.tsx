import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import "./comment.css"
import { PostComment } from "../models"
import { getCommentData } from "./fetch"
import { convertDateToString } from "../../additional-functions/time"
import Avatar from "./Avatar"
import Username from "./Username"
import { ErrorSkeleton } from "../render-states/ErrorSkeleton"
import { Attachment, AttachmentsList, AttachmentsToggler } from "../attachments/Attachments"

interface CommentProps {
    commentId: number
}

export default function Comment({ commentId }: CommentProps) {
    const [comment, setComment] = useState<PostComment>(null)
    const [err, setErr] = useState<Error>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false)
    const attachmentsCount = comment?.attachments.length

    useEffect(() => {
        getCommentData(commentId, setComment, setErr, setIsLoading)
    }, [commentId])

    const toggleAttachments = () => setIsAttachmentsOpen(!isAttachmentsOpen)

    if (err) return <ErrorSkeleton message={err.message} />
    if (isLoading) return <LoadingSkeleton dataName="comment" />
    if (!comment) return <div>No comment found.</div>
    return (
        <div className="post__comment">
            <div className="comment__info">
                <Avatar userId={comment.userId} />
                <div className="comment__user">
                    <Link to={`/user/${comment.userId}`} className="comment__user__link">
                        <Username userId={comment.userId} commentLogin={comment.login} />
                    </Link>
                    <span className="comment__timestamp">
                        {convertDateToString(comment.dateOfCreation)}
                    </span>
                </div>
            </div>

            {comment.text ? (
                <p className="comment__text">{comment.text}</p>
            ) : (
                attachmentsCount > 0 && <Attachment src={comment.attachments[0]} />
            )}
            {attachmentsCount > 0 && isAttachmentsOpen && (
                <AttachmentsList data={comment.attachments} text={comment.text} />
            )}
            {attachmentsCount > 1 && (
                <AttachmentsToggler
                    isOpen={isAttachmentsOpen}
                    attachmentsCount={attachmentsCount}
                    onClick={toggleAttachments}
                    text={comment.text}
                />
            )}
        </div>
    )
}
