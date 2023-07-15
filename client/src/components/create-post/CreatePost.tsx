import "./create-post.css"
import { useState } from "react"
import { Post, PostFormFields, ServerResponse } from "../../models"
import fetchHandler from "../../additional-functions/fetchHandler"
import toggleHook from "../../hooks/useToggle"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { PostPrivacy, PrivacySettings } from "./PostPrivacy"
import PostText from "./PostText"
import AddedAttachmentsList from "../attachments/AddedAttachmentsList"
import { AttachmentInput } from "../attachments/AttachmentInput"
import { ErrorsDisplayType, useErrorsContext } from "../error-display/ErrorDisplay"

interface CreatePostProp {
    setPostIdList: React.Dispatch<React.SetStateAction<number[]>>
}

export default function CreatePost({ setPostIdList }: CreatePostProp) {
    const { toggle: modalOpen, toggleChange: toggleModal } = toggleHook(false)

    return (
        <div className="modal-wrapper">
            <button type="button" className="button button_non-stretched" onClick={toggleModal}>
                Create post
            </button>
            {modalOpen ? <Modal {...{ toggleModal, setPostIdList }} /> : null}
        </div>
    )
}

interface ModalProps {
    toggleModal: () => void
    setPostIdList: React.Dispatch<React.SetStateAction<number[]>>
}

function Modal({ toggleModal, setPostIdList }: ModalProps) {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()
    const defaultFormData: PostFormFields = {
        privacy: PrivacySettings.Public,
        text: "",
        attachments: [],
        authorizedFollowers: [],
    }
    const [formData, setFormData] = useState<PostFormFields>(defaultFormData)
    const [attachmentData, setAttachmentData] = useState<{ name: string; value: string }[]>([])
    const [fileIsLoading, setFileLoading] = useState(false)

    return (
        <div className="post-form__fixed-container">
            <div className="post-form__wrapper">
                <form
                    className="post-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        formData.attachments = attachmentData.map((attachment) => attachment.value)
                        handleSubmit(formData, navigate, displayErrors).then((result: Post) => {
                            if (result !== null) {
                                setFormData(defaultFormData)
                                setAttachmentData([])
                                setPostIdList((prev) => [...prev, result.id])
                                toggleModal()
                            }
                        })
                    }}
                >
                    <PostText
                        {...{
                            formData,
                            setFormData,
                        }}
                    />
                    <AddedAttachmentsList
                        {...{
                            attachmentData,
                            setAttachmentData,
                        }}
                    />
                    <div className="post-form__bar">
                        <div className="post-form__options">
                            <PostPrivacy
                                {...{
                                    formData,
                                    setFormData,
                                    navigate,
                                }}
                            />
                            <AttachmentInput
                                {...{
                                    setFileLoading,
                                    setAttachmentData,
                                }}
                            />
                        </div>
                        <div className="post-form__buttons">
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="button  button_red"
                                disabled={fileIsLoading}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="button" disabled={fileIsLoading}>
                                Create
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

function handleSubmit(
    formData: PostFormFields,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
) {
    return fetchHandler(
        `http://localhost:8080/user/${localStorage.getItem("id")}/posts`,
        "POST",
        formData,
    )
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r: ServerResponse<Post>) => {
            if (r.errors) throw r.errors
            return r.data
        })
        .catch((errArr) => {
            // navigate("/internal-error")
            fetchErrorChecker(errArr, navigate, displayErrors)
            return null
        })
}
