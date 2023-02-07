import "./userPost.css"
import {useRef, useState} from "react";

interface Post {
    text: string | null
    attachments: string[]
}

interface UserPostProps {
    post: Post
}

function UserPost({post}: UserPostProps) {
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const attachmentsCountRef = useRef(post.attachments.length);

    return (
        <article className="post">
            {post.text ? <p className="post-text">{post.text}</p> : <img src={post.attachments[0]}
                                                                         alt="placeholder"/>}

            {attachmentsCountRef.current > 0 && attachmentsOpen && post.attachments.slice(post.text ? 0 :
                1).map(att => (
                <img src={att}
                     alt="placeholder"/>
            ))}

            <div className="post__actions flex">
                {attachmentsCountRef.current > 0 &&
                    <p style={{color: "red"}}
                       onClick={() => setAttachmentsOpen(!attachmentsOpen)}>{attachmentsOpen ? "Show less" :
                        `Show ${post.text ? attachmentsCountRef.current :
                            attachmentsCountRef.current - 1} more attachment${attachmentsCountRef.current > 1 ? "s" :
                            ""}...`}</p>}
                <p className="post__add-comment">Comment</p>
            </div>
        </article>
    )
}

const postList: Post[] = [
    {
        text: "On the other hand, we denounce with righteous indignation and dislike men who are" +
            " so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they" +
            " cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and...",
        attachments: ["https://via.placeholder.com/150"]
    },
    {
        text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.",
        attachments: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"]
    },
    {
        text: "",
        attachments: [
            "https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150"
        ]
    },
    {
        text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.",
        attachments: []
    },
]

export default function PostList() {
    return (
        <div className="postList flex-column">
            {postList.map((post, i) => (
                <UserPost post={post}
                          key={i}/>
            ))}
        </div>
    )
}