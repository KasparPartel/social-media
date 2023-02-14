import "./userPost.css"
import icon from "../../assets/SVGRepo_iconCarrier.svg"
import { useEffect, useState } from "react"

export interface Post {
    id: number
    userId: number
    text: string
    attachments: string[]
}

interface UserPostProps {
    postId: number
}

export default function UserPost({ postId }: UserPostProps) {
    const [post, setPost] = useState<Post>()
    const [err, setErr] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [attachmentsOpen, setAttachmentsOpen] = useState(false)
    const [attachmentsCount, setAttachmentsCount] = useState(0)

    useEffect(() => {
        const getPost = async () => {
            fetch(`http://localhost:8080/post/${postId}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`This is an HTTP error: The status is ${res.status}`)
                    }
                    return res.json()
                })
                .then(
                    (data) => {
                        setPost(data)
                        setIsLoading(false)
                    },
                    (err) => {
                        setErr(err)
                        setIsLoading(false)
                    },
                )
        }

        getPost()
    }, [])

    useEffect(() => {
        if (post) {
            setAttachmentsCount(post.attachments.length)
        }
    }, [post])

    const toggleAttachments = () => {
        setAttachmentsOpen(!attachmentsOpen)
    }

    if (err) return <div>{err.message}</div>
    if (isLoading) return <div>🌀 Loading post...</div>
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
