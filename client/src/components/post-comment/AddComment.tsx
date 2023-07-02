import sendIcon from "../../assets/send-outline.svg"
import { useState } from "react"
import { PostComment, User } from "../models"
import { postComment } from "./fetch"
import { AttachmentInput } from "../attachments/AttachmentInput"
import AddedAttachmentsList from "../attachments/AddedAttachmentsList"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { useNavigate } from "react-router-dom"

interface AddCommentProps {
    postId: number
    myUser: User
    setCommentsIdList: React.Dispatch<React.SetStateAction<number[]>>
}

export default function AddComment({ postId, myUser, setCommentsIdList }: AddCommentProps) {
    const navigate = useNavigate()
    const [inputText, setInputText] = useState("")
    const [attachmentData, setAttachmentData] = useState<{ name: string; value: string }[]>([])
    const [isFileLoading, setFileLoading] = useState(false)
    const [isSubmitting, setSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const text = inputText.trim()
        if ((text === "" && attachmentData.length === 0) || isFileLoading || isSubmitting) {
            return
        }

        setSubmitting(true)
        const attachments = attachmentData.map((attachment) => attachment.value)

        const comment: PostComment = {
            creationDate: Date.now(),
            login: myUser.login ?? "",
            parentId: 0,
            text: text,
            userId: myUser.id,
            attachments: attachments,
        }

        const fetchPostComment = async () => {
            try {
                const data = await postComment(postId, comment)
                if (data.errors) {
                    fetchErrorChecker(data.errors, navigate)
                    return
                }
                setCommentsIdList((prevState) => [...prevState, data.data.id])

                setInputText(() => "")
                setAttachmentData(() => [])
            } catch (e) {
                console.log(e as Error)
            } finally {
                setFileLoading(false)
                setSubmitting(false)
            }
        }

        fetchPostComment()
    }

    return (
        <form className="comment__form" onSubmit={(e) => handleSubmit(e)}>
            <div className="comment-posting__container">
                <input
                    type="text"
                    name="addComment"
                    className="comment__input"
                    placeholder="Type a comment..."
                    autoComplete="off"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    required={attachmentData.length == 0}
                />
                <div className="comment-posting__buttons">
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
            </div>
            {attachmentData.length > 0 && <hr className="attachments__separator" />}
            <AddedAttachmentsList {...{ attachmentData, setAttachmentData }} />
        </form>
    )
}
