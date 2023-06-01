import sendIcon from "../../assets/send-outline.svg"
import { useState } from "react"
import { PostComment, User } from "../models"
import { postComment } from "./fetch"

interface AddCommentProps {
    postId: number
    myUser: User
}

export default function AddComment({ postId, myUser }: AddCommentProps) {
    const [inputText, setInputText] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

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
            attachments: [],
        }

        try {
            postComment(postId, comment)
        } catch (e) {
            console.log(e as Error)
        }
    }

    return (
        <form className="comment__form" onSubmit={(e) => handleSubmit(e)}>
            <input
                type="text"
                name="addComment"
                className="comment__input"
                placeholder="Type a comment..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="comment__btn">
                <img src={sendIcon} alt="send" className="comment__img" />
            </button>
        </form>
    )
}
