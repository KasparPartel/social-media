import "./userPost.css"
import icon from "../../assets/SVGRepo_iconCarrier.svg"
import { useEffect, useState } from "react"

export interface Post {
    id: number
    userId: number
    text: string | null
    attachments: string[]
}

interface UserPostProps {
    postId: number
}

export default function UserPost({ postId }: UserPostProps) {
    const [post, setPost] = useState<Post>()
    const [err, setErr] = useState<Error | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [attachmentsOpen, setAttachmentsOpen] = useState(false)
    const [attachmentsCount, setAttachmentsCount] = useState(0)

    useEffect(() => {
        setTimeout(
            () =>
                fetch(`http://localhost:8080/post/${postId}`)
                    .then((res) => {
                        if (res.status >= 400) {
                            throw new Error("Server responds with error!")
                        }
                        return res.json()
                    })
                    .then(
                        (data) => {
                            setPost(data)
                            setIsLoaded(true)
                        },
                        (err) => {
                            setErr(err)
                            setIsLoaded(true)
                        },
                    ),
            3000,
        )
    }, [])

    useEffect(() => {
        if (post) {
            setAttachmentsCount(post.attachments.length)
        }
    }, [post])

    const toggleAttachments = () => {
        setAttachmentsOpen(!attachmentsOpen)
    }

    if (err) {
        return <div>{err.message}</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
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
                        <p
                            className="post__attachments-toggler"
                            onClick={() => toggleAttachments()}
                        >
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
}
