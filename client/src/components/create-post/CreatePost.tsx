import "./create-post.css"
import { useState } from "react"
import { PostFormFields } from "../models"
import fetchHandler from "../../additional-functions/fetchHandler"
import toggleHook from "../../hooks/useToggle"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { PostPrivacy, PrivacySettings } from "./PostPrivacy"
import PostText from "./PostText"
import AddedAttachmentsList from "../attachments/AddedAttachmentsList"
import { AttachmentInput } from "../attachments/AttachmentInput"

export default function CreatePost() {
    const { toggle: modalOpen, toggleChange: toggleModal } = toggleHook(false)

    return (
        <div className="modal-wrapper">
            <button type="button" className="button button_non-stretched" onClick={toggleModal}>
                Create post
            </button>
            {modalOpen ? <Modal {...{ toggleModal }} /> : null}
        </div>
    )
}

interface ModalProp {
    toggleModal: () => void
}

function Modal({ toggleModal }: ModalProp) {
    const navigate = useNavigate()
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
                        const result = handleSubmit(formData, navigate)
                        if (result) {
                            setFormData(defaultFormData)
                            setAttachmentData([])
                            toggleModal()
                        }
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
                                    navigate
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

function handleSubmit(formData: PostFormFields, navigate: NavigateFunction): boolean {
    if (
        formData.privacy >= 1 &&
        formData.privacy <= 3 &&
        (formData.text != "" || formData.attachments.length > 0)
    ) {
        fetchHandler(
            `http://localhost:8080/user/${localStorage.getItem("id")}/posts`,
            "POST",
            formData,
        )
            .then((r) => r.json())
            .then((r) => {
                if (r.errors) {
                    const errors = fetchErrorChecker(r.errors, navigate)
                    if (errors) errors.forEach((err) => alert(err.description))
                    return false
                }
                alert("Post created successfully!")
            })
        return true
    }
    alert("No user input or privacy setting is wrong")
}
