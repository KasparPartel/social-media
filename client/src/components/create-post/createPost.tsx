import "./createPost.css"
import { useState } from "react"
import { PostFormFields } from "../models"
import fetchHandler from "../../additional-functions/fetchHandler"
import toggleHook from "../../hooks/useToggle"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { PostPrivacy, PrivacySettings } from "./privacySection"
import PostText from "./text"
import AddedAttachmentsList from "../attachments/AddedAttachmentsList"
import { AttachmentInput } from "../attachments/AttachmentInput"

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
    const navigate = useNavigate()
    const deafultFormData: PostFormFields = {
        privacy: PrivacySettings.Public,
        text: "",
        attachments: [],
        authorizedFollowers: [],
    }
    const [formData, setFormData] = useState<PostFormFields>(deafultFormData)
    const [attachmentData, setAttachmentData] = useState<{ name: string; value: string }[]>([])
    const [fileIsLoading, setFileLoading] = useState(false)

    return (
        <div className="create-post-wrapper">
            <form
                className="post-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    formData.attachments = attachmentData.map((attachment) => attachment.value)
                    const result = handleSubmit(formData, navigate)
                    if (result) {
                        setFormData(deafultFormData)
                        setAttachmentData([])
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
                            }}
                        />
                        <AttachmentInput
                            {...{
                                setFileLoading,
                                setAttachmentData,
                            }}
                        />
                    </div>
                    <button type="submit" className="button" disabled={fileIsLoading}>
                        Create
                    </button>
                </div>
            </form>
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
