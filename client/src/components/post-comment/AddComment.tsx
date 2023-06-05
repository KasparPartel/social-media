import sendIcon from "../../assets/send-outline.svg"
import { useState } from "react"
import { PostComment, User } from "../models"
import { postComment } from "./fetch"
import { AttachmentInput } from "../attachments/AttachmentInput"
import AddedAttachmentsList from "../attachments/AddedAttachmentsList"

interface AddCommentProps {
    postId: number
    myUser: User
}

export default function AddComment({ postId, myUser }: AddCommentProps) {
    const [inputText, setInputText] = useState("")
    const [attachmentData, setAttachmentData] = useState<{ name: string; value: string }[]>([])
    const [isFileLoading, setFileLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const attachments = attachmentData.map((attachment) => attachment.value)

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
            attachments: attachments,
        }

        try {
            postComment(postId, comment)
        } catch (e) {
            console.log(e as Error)
        }
    }

    return (
        <form className="comment__form" onSubmit={(e) => handleSubmit(e)}>
            <div className="comment-posting__container">
                <input
                    type="text"
                    name="addComment"
                    className="comment__input"
                    placeholder="Type a comment..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <AttachmentInput
                    {...{
                        setFileLoading,
                        setAttachmentData,
                    }}
                >
                    {attachmentData.length > 0 && (
                        <span className="attachment_count">{attachmentData.length}</span>
                    )}
                </AttachmentInput>
                <button type="submit" className="comment__btn" disabled={isFileLoading}>
                    <img src={sendIcon} alt="send" className="comment__img" />
                </button>
            </div>
            {attachmentData.length > 0 && <hr className="attachments__separator" />}
            <AddedAttachmentsList {...{ attachmentData, setAttachmentData }} />
        </form>
    )
}
