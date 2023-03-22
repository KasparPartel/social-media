import { useState } from "react"
import { formDataExtractor, toBase64 } from "../additional-functions/af"
import attachmentIcon from "../../assets/attachment_icon.svg"
import privateAddIcon from "../../assets/private_add.svg"
import "./createPost.css"
import { PostFormFields } from "../models"

function toggleHook(initialState: boolean) {
    const [toggle, setToggle] = useState(initialState)
    const toggleChange = () => {
        setToggle(!toggle)
    }
    return { toggle, toggleChange }
}

export default function CreatePost() {
    const { toggle: modalOpen, toggleChange: toggleModal } = toggleHook(false)

    return (
        <>
            {modalOpen ? (
                <Modal toggleModal={toggleModal} />
            ) : (
                <button onClick={toggleModal}>Create post</button>
            )}
        </>
    )
}

interface ModalProps {
    toggleModal: () => void
}

function Modal({ toggleModal }: ModalProps) {
    const [attachments, setAttachments] = useState<{ name: string; value: string }[]>([])
    const [privacy, setPrivacy] = useState("1")
    const { toggle: overlayOpen, toggleChange: toggleOverlay } = toggleHook(false)

    const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = e.target.files
            const i = e.target.files.length - 1
            toBase64(fileList[i]).then((data) =>
                setAttachments((prevState) => [
                    ...prevState,
                    { name: fileList[i].name, value: data },
                ]),
            )
        }
    }

    const handleRemoveAttachment = (i: number) => {
        setAttachments((prevState) => {
            const arrCopy = [...prevState]
            arrCopy.splice(i, 1)
            return [...arrCopy]
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formFields: PostFormFields = {
            privacy: "",
            body: "",
            attachments: [],
        }
        formDataExtractor(new FormData(e.currentTarget), formFields, attachments)
        console.log(formFields)
    }

    return (
        <>
            <button onClick={toggleModal}>close</button>
            <div className="create-post">
                <form className="create-post__form" onSubmit={(e) => handleSubmit(e)}>
                    <textarea name="body" className="create-post__text"></textarea>

                    <ul className="create-post__attachment-list">
                        {attachments &&
                            attachments.map((file, i) => (
                                <li className="create-post__attachment" key={i}>
                                    {file.name} - {" "}
                                    <span onClick={() => handleRemoveAttachment(i)}>remove</span>
                                </li>
                            ))}
                    </ul>

                    <div className="create-post__options">
                        <div className="create-post__settings">
                            <select
                                name="privacy"
                                value={privacy}
                                onChange={(e) => setPrivacy(e.target.value)}
                                className="create-post__settings__privacy"
                            >
                                <option value="1">Public</option>
                                <option value="2">Semi</option>
                                <option value="3">Private</option>
                            </select>

                            {privacy === "2" && (
                                <>
                                    <img
                                        className="create-post__add-users__img"
                                        src={privateAddIcon}
                                        alt="add users"
                                        onClick={toggleOverlay}
                                    />
                                    {overlayOpen ? (
                                        <PrivacyOverlay toggleModal={toggleOverlay} />
                                    ) : null}
                                </>
                            )}

                            <label
                                htmlFor="attachment"
                                className="create-post__settings__attachment__label"
                            >
                                <img
                                    className="create-post__settings__attachment__img"
                                    src={attachmentIcon}
                                    alt="attachment"
                                />
                                <input
                                    onChange={(e) => handleAddAttachment(e)}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    name="attachments"
                                    id="attachment"
                                    hidden
                                />
                            </label>
                        </div>

                        <button className="create-post__create-btn">Create</button>
                    </div>
                </form>
            </div>
        </>
    )
}

function PrivacyOverlay({ toggleModal }: ModalProps) {
    return (
        <div className="create-post__add-users">
            <button onClick={toggleModal}>toggleModal</button>
        </div>
    )
}
