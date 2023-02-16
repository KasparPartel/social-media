import { useEffect, useRef, useState } from "react"

import attachmentIcon from "../../assets/attachment_icon.svg"
import privateAddIcon from "../../assets/private_add.svg"
import "./createPost.css"

export default function CreatePost() {
    const [modalOpen, setModalOpen] = useState(false)

    const toggleModal = () => {
        setModalOpen(!modalOpen)
    }

    return (
        <>
            {modalOpen ? (
                <Modal toggleModal={toggleModal} />
            ) : (
                <button onClick={() => setModalOpen(!modalOpen)}>Create post</button>
            )}
        </>
    )
}

interface ModalProps {
    toggleModal: () => void
}

interface Post {
    text: string
    attachments: string[]
    privacy: 0 | 1 | 2
    authorizedFollowers: number[]
}

function Modal({ toggleModal }: ModalProps) {
    // const [post, setPost] = useState<Post>()
    const [attachments, setAttachments] = useState<string[]>([])
    const [privacy, setPrivacy] = useState("1")

    useEffect(() => {
        console.log(attachments)
    }, [attachments])

    const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        toggleModal()
    }

    const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileNames = Array.from(e.target.files).map((file) => file.name)
            setAttachments((prevState) => [...prevState, ...fileNames])
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formElements = form.elements
        console.log(formElements)
    }

    const handleRemoveAttachment = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        i: number,
    ) => {
        // e.preventDefault()
        setAttachments((prevState) => {
            const arrCopy = [...prevState]
            arrCopy.splice(i, 1)
            return [...arrCopy]
        })
    }

    return (
        <div className="create-post">
            {/*<button onClick={(e) => handleClose(e)}>close</button>*/}
            <form className="create-post__form" onSubmit={(e) => handleSubmit(e)}>
                <textarea name="body" className="create-post__text"></textarea>

                <ul className="create-post__attachment-list">
                    {attachments &&
                        attachments.map((file, i) => (
                            <li className="create-post__attachment" key={i}>
                                {file} -{" "}
                                <span onClick={(e) => handleRemoveAttachment(e, i)}>
                                            remove
                                        </span>
                            </li>
                        ))}
                </ul>

                <div className="create-post__options">
                    <div className="create-post__settings">
                        <select name="privacy" value={privacy} onChange={(e) => setPrivacy(e.target.value)}
                                className="create-post__settings__privacy">
                            <option value="0">Public</option>
                            <option value="1">Semi</option>
                            <option value="2">Private</option>
                        </select>

                        {privacy === "1" &&
                            <img className="create-post__add-users__img" src={privateAddIcon} alt="add users" />}

                        <label htmlFor="attachment" className="create-post__settings__attachment__label">
                            <img className="create-post__settings__attachment__img" src={attachmentIcon}
                                 alt="attachment" />
                        </label>

                        <input
                            onChange={(e) => handleAddAttachment(e)}
                            type="file"
                            multiple
                            accept="image/*"
                            name="attachment"
                            id="attachment"
                            hidden
                        />
                    </div>

                    <button className="create-post__create-btn">Create</button>
                </div>
            </form>
        </div>
    )
}
