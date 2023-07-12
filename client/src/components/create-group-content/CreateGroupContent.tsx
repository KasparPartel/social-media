import { useNavigate } from "react-router-dom"
import { GroupFormFields } from "../models"
import { useState } from "react"
import toggleHook from "../../hooks/useToggle"
import fetchHandler from "../../additional-functions/fetchHandler"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { useErrorsContext } from "../error-display/ErrorDisplay"

interface CreateGroupContentProp {
    isPosts: boolean
    groupId: number
}

interface GroupContentFormProps {
    isPosts: boolean
    toggleModal: () => void
    groupId: number
}

export function CreateGroupContent({ isPosts, groupId }: CreateGroupContentProp) {
    const { toggle: modalOpen, toggleChange: toggleModal } = toggleHook(false)

    return (
        <>
            <button className="button group__button" onClick={toggleModal}>
                {isPosts ? "Create post" : "Create event"}
            </button>
            {modalOpen ? <GroupContentForm {...{ isPosts, toggleModal, groupId }} /> : null}
        </>
    )
}

function GroupContentForm({ isPosts, toggleModal, groupId }: GroupContentFormProps) {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()
    const defaultFormData: GroupFormFields = {
        text: "",
        isEvent: !isPosts,
        title: "",
        datetime: null, // milliseconds
    }
    const [formData, setFormData] = useState<GroupFormFields>(defaultFormData)

    return (
        <div className="post-form__fixed-container">
            <div className="post-form__wrapper post-form__wrapper_auto-height">
                <form
                    className="post-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!isPosts && !formData.datetime) {
                            fetchErrorChecker(
                                [{ code: 19, description: `no input provided` }],
                                navigate,
                                displayErrors,
                            )
                            return
                        }

                        fetchHandler(
                            `http://localhost:8080/group/${groupId}/feed`,
                            "POST",
                            formData,
                        )
                            .then((r) => {
                                if (!r.ok) {
                                    throw [
                                        {
                                            code: r.status,
                                            description: `HTTP error: ${r.statusText}`,
                                        },
                                    ]
                                }
                                return r.json()
                            })
                            .then((r) => {
                                if (r.errors) throw r.errors
                                setFormData(defaultFormData)
                                toggleModal()
                            })
                            .catch((err) => {
                                fetchErrorChecker(err, navigate, displayErrors)
                            })
                    }}
                >
                    {!isPosts ? (
                        <input
                            className="form__field form__field_white"
                            placeholder="Title"
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prevValues) => {
                                    const temp = Object.assign({}, prevValues)
                                    temp.title = e.target.value
                                    return temp
                                })
                            }
                        />
                    ) : null}
                    <textarea
                        placeholder="Text"
                        onChange={(e) => {
                            setFormData((prevValues) => {
                                const temp = Object.assign({}, prevValues)
                                temp.text = e.target.value
                                return temp
                            })
                        }}
                        value={formData.text}
                        className="post-form__text"
                    />
                    <div
                        className={`post-form__bar${!isPosts ? "" : " post-form__bar_reverse-flex"
                            }`}
                    >
                        {!isPosts ? (
                            <input
                                type="date"
                                onChange={(e) => {
                                    setFormData((prevValues) => {
                                        const temp = Object.assign({}, prevValues)
                                        temp.datetime = Date.parse(e.target.value)
                                        return temp
                                    })
                                }}
                            />
                        ) : null}
                        <div className="post-form__buttons">
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="button  button_red"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="button">
                                Create
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
