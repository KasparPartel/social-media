import "./createPost.css"
import attachmentIcon from "../../assets/attachment_icon.svg"
import privateAddIcon from "../../assets/private_add.svg"
import privateResetIcon from "../../assets/Reset.svg"
import { useState } from "react"
import { PostFormFields } from "../models"
import { toBase64 } from "../../additional-functions/images"
import fetchHandler from "../../additional-functions/fetchHandler"
import toggleHook from "../../hooks/useToggle"
import PrivacyOverlay from "./privacyOverlay"

const PrivacySettings = {
    Public: "1",
    Semi: "2",
    Private: "3",
}

interface attachment {
    name: string
    value: string
}

export default function CreatePost() {
    const { toggle: modalOpen, toggleChange: toggleModal } = toggleHook(false)

    return (
        <>
            {modalOpen ? (
                <>
                    <button type="button" className="button" onClick={toggleModal}>
                        Close
                    </button>
                    <Modal />
                </>
            ) : (
                <button type="button" className="button" onClick={toggleModal}>
                    Create post
                </button>
            )}
        </>
    )
}

function Modal() {
    const userId = Number(localStorage.getItem("id"))
    const [postText, setText] = useState("")
    const [postAttachments, setAttachments] = useState<attachment[]>([])
    const [postPrivacy, setPrivacy] = useState(PrivacySettings.Public)
    const [postAllowedUsers, setAllowedUsers] = useState<number[]>([])
    const { toggle: overlayOpen, toggleChange: toggleOverlay } = toggleHook(false)

    return (
        <div className="create-post-wrapper">
            <form
                className="post-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(
                        postText,
                        Number(postPrivacy),
                        postAttachments,
                        postAllowedUsers,
                        userId,
                    )
                    setText("")
                    setAttachments([])
                    setPrivacy(PrivacySettings.Public)
                    setAllowedUsers([])
                }}
            >
                <textarea
                    name="text"
                    onChange={(e) => setText(e.currentTarget.value)}
                    value={postText}
                    className="post-form__text"
                />

                <ul className="post-form__attachment-list">
                    {postAttachments &&
                        postAttachments.map((file, i) => (
                            <li className="post-form__attachment" key={i}>
                                {file.name} -{" "}
                                <span onClick={() => handleRemoveAttachment(i, setAttachments)}>
                                    remove
                                </span>
                            </li>
                        ))}
                </ul>

                <div className="post-form__bar">
                    <div className="post-form__options">
                        <select
                            name="privacy"
                            value={postPrivacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            className="post-form__privacy"
                        >
                            <option value={PrivacySettings.Public}>Public</option>
                            <option value={PrivacySettings.Semi}>Semi</option>
                            <option value={PrivacySettings.Private}>Private</option>
                        </select>

                        {postPrivacy === PrivacySettings.Semi && (
                            <>
                                <img
                                    className="post-form__add-users-img"
                                    src={
                                        postAllowedUsers.length > 0
                                            ? privateResetIcon
                                            : privateAddIcon
                                    }
                                    alt="add users"
                                    onClick={toggleOverlay}
                                />
                                {postAllowedUsers.length > 0 ? (
                                    <div className="post-form__add-users-info">
                                        Added {postAllowedUsers.length}{" "}
                                        {postAllowedUsers.length > 1 ? "users" : "user"}
                                    </div>
                                ) : null}
                                {overlayOpen ? (
                                    <PrivacyOverlay
                                        {...{
                                            toggleModal: toggleOverlay,
                                            userId,
                                            postAllowedUsers,
                                            setAllowedUsers,
                                        }}
                                    />
                                ) : null}
                            </>
                        )}

                        <label className="post-form__attachment-label">
                            <img
                                className="post-form__attachment-img"
                                src={attachmentIcon}
                                alt="attachment"
                            />
                            <input
                                onChange={(e) => handleAddAttachment(e, setAttachments)}
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/gif"
                                name="attachments"
                                hidden
                            />
                        </label>
                    </div>

                    <button type="submit" className="button">
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>, setAttachments) => {
    if (e.target.files) {
        const fileList = e.target.files
        const i = e.target.files.length - 1

        toBase64(fileList[i]).then((data) =>
            setAttachments((prevState: attachment[]) => [
                ...prevState,
                { name: fileList[i].name, value: data },
            ]),
        )
    }
}

const handleRemoveAttachment = (i: number, setAttachments) => {
    setAttachments((prevState: attachment[]) => {
        const arrCopy = [...prevState]
        arrCopy.splice(i, 1)
        return [...arrCopy]
    })
}

const handleSubmit = (
    text: string,
    privacy: number,
    attachments: attachment[],
    authorizedFollowers: number[],
    userId: number,
) => {
    if (privacy >= 1 && privacy <= 3 && text) {
        const formFields: PostFormFields = {
            privacy,
            text,
            attachments: attachments.map((attachment) => attachment.value),
            ...(privacy === 2 && { authorizedFollowers }),
        }

        fetchHandler(`http://localhost:8080/user/${userId}/posts`, "POST", formFields)
            .then((r) => r.json())
            .then(console.log)
        //TODO: handle error and success in return
        return
    }
    alert("Text is empty or privacy setting is wrong")
}
