import { useEffect, useState } from "react"
import icon from "../../assets/SVGRepo_iconCarrier.svg"
import { useOpenText } from "../../hooks/useOpenText"
import { Post } from "../models"
import CommentList from "../post-comment/CommentList"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import "./userPost.css"
import { getPostData } from "./fetch"
import moment from "moment"
import { ErrorSkeleton } from "../render-states/ErrorSkeleton"
import { Attachment, AttachmentsList, AttachmentsToggler } from "../attachments/Attachments"

interface UserPostProps {
    postId: number
    background?: string
}

export default function UserPost({ postId, background }: UserPostProps) {
    const [post, setPost] = useState<Post>(null)
    const [err, setErr] = useState<Error>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false)
    const { style, refText, openText } = useOpenText(215)
    const attachmentsCount = post?.attachments.length
    background = background ? ` ${background}` : ""

    useEffect(() => {
        getPostData(postId, setPost, setErr, setIsLoading)
    }, [])

    const toggleAttachments = () => setIsAttachmentsOpen(!isAttachmentsOpen)

    if (err) return <ErrorSkeleton message={err.message} />
    if (isLoading) return <LoadingSkeleton color="orange" dataName="post" />
    return (
        <article className={"post" + background}>
            <p className="post__info">
                {`${post.login ? post.login : `${post.firstName} ${post.lastName}`}`}

                <span className="post__info__date">
                    {moment(post.creationDate).format("YYYY-MM-DD")}
                </span>
            </p>

            {post.text ? (
                <p ref={refText} className="post__text" style={style} onClick={openText}>
                    {post.text}
                </p>
            ) : (
                <Attachment src={post.attachments[0]} />
            )}

            {attachmentsCount > 0 && isAttachmentsOpen && (
                <AttachmentsList data={post.attachments} text={post.text} />
            )}

            <div className="post__actions">
                {((attachmentsCount > 0 && post.text) || attachmentsCount > 1) && (
                    <AttachmentsToggler
                        isOpen={isAttachmentsOpen}
                        attachmentsCount={attachmentsCount}
                        onClick={toggleAttachments}
                        text={post.text}
                    />
                )}

                <img
                    className="post__add-comment"
                    src={icon}
                    alt="comment icon"
                    onClick={() => setCommentsOpen(!commentsOpen)}
                />
            </div>

            {commentsOpen && <CommentList postId={postId} />}
        </article>
    )
}
