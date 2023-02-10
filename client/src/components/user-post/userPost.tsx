import "./userPost.css"
import icon from "../../assets/SVGRepo_iconCarrier.svg"
import { useState } from "react"

export interface Post {
    text: string | null
    attachments: string[]
}

interface UserPostProps {
    post: Post
}

export default function UserPost({ post }: UserPostProps) {
    const [attachmentsOpen, setAttachmentsOpen] = useState(false)
    const [attachmentsCount] = useState(post.attachments.length)

    const toggleAttachments = () => {
        setAttachmentsOpen(!attachmentsOpen)
    }

    return (
        <article className="post">
            {post.text ? (
                <p className="post__text">{post.text}</p>
            ) : (
                <img className="post__attachment" src={post.attachments[0]} alt="placeholder" />
            )}

            {attachmentsCount > 0 &&
                attachmentsOpen &&
                post.attachments
                    .slice(post.text ? 0 : 1)
                    .map((att, i) => (
                        <img className="post__attachment" key={i} src={att} alt="placeholder" />
                    ))}

            <div className="post__actions">
                {attachmentsCount > 0 && (
                    <p className="post__attachments-toggler" onClick={() => toggleAttachments()}>
                        {attachmentsOpen
                            ? "Show less"
                            : `Show ${
                                  post.text ? attachmentsCount : attachmentsCount - 1
                              } more attachment${attachmentsCount > 1 ? "s" : ""}`}
                    </p>
                )}

                <img className="post__add-comment" src={icon} alt="comment icon" />
            </div>
        </article>
    )
}