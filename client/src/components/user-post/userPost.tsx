import "./userPost.css"
import icon from "../../assets/SVGRepo_iconCarrier.svg"
import { useEffect, useRef, useState } from "react"

export interface Post {
    text: string | null
    attachments: string[]
}

interface UserPostProps {
    post: Post
}

export default function UserPost({ post }: UserPostProps) {
    const [attachmentsOpen, setAttachmentsOpen] = useState<boolean>(false)
    const attachmentsCount = post.attachments.length
    const [textOpen, setTextOpen] = useState<boolean>(false)

    const toggleAttachments = () => {
        setAttachmentsOpen(!attachmentsOpen)
    }

    const togglePostText = () => {
        setTextOpen(!textOpen)
    }

    const refText = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(215);
    useEffect(() => { textOpen ? setHeight(refText.current.scrollHeight) : setHeight(215) }, [textOpen]);

    return (
        <article className="post">
            {post.text ? (
                <p
                    ref={refText}
                    className="post__text"
                    style={{ maxHeight: `${height}px` }}
                    onClick={() => { togglePostText() }}
                >
                    {post.text}
                </p>
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
                            : `Show ${post.text ? attachmentsCount : attachmentsCount - 1
                            } more attachment${attachmentsCount > 1 ? "s" : ""}`}
                    </p>
                )}

                <img className="post__add-comment" src={icon} alt="comment icon" />
            </div>
        </article>
    )
}
