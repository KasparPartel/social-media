import "./createGroup.css"
import React, { useState } from "react"
import fetchHandler from "../../additional-functions/fetchHandler"
import { Group, MakeGroupFormFields, ServerResponse } from "../models"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { ErrorsDisplayType, useErrorsContext } from "../error-display/ErrorDisplay"

const defaultGroupFormData: MakeGroupFormFields = {
    title: "",
    description: "",
}
export default function CreateGroup({ setGroups }: { setGroups }) {
    const [isFormOpen, setFormOpen] = React.useState(false)
    const [formData, setFormData] = useState<MakeGroupFormFields>(defaultGroupFormData)
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    return (
        <>
            <input
                type="button"
                className="create-new-group__button button create-group__button"
                value="CREATE NEW GROUP"
                onClick={() => setFormOpen(true)}
            />
            {isFormOpen ? (
                <div className="create-group-form__absolute-wrapper">
                    <div className="create-group-form__flex-wrapper">
                        <form
                            className="create-group-form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit(formData, navigate, displayErrors).then((r) => {
                                    if (r) {
                                        setFormOpen(false)
                                        setFormData(defaultGroupFormData)
                                        setGroups((prev: Group[]) => {
                                            const temp = prev.slice()
                                            const { data: group } = r
                                            group.isOwner = true
                                            group.joinStatus = 3
                                            temp.push(group)
                                            return temp
                                        })
                                    }
                                })
                            }}
                        >
                            <input
                                className="create-group-form__textinput"
                                placeholder="TITLE"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        ["title"]: e.target.value,
                                    }))
                                }}
                            />
                            <textarea
                                className="create-group-form__textinput create-group-form__textarea"
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        ["description"]: e.target.value,
                                    }))
                                }}
                            />

                            <div className="create-group-form__buttons">
                                <input
                                    type="button"
                                    className="button button_red"
                                    value="Cancel"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setFormOpen(false)
                                        setFormData(defaultGroupFormData)
                                    }}
                                />
                                <input type="submit" className="button" value="Submit" />
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    )
}

function handleSubmit(
    data: MakeGroupFormFields,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
): Promise<ServerResponse<Group> | null> {
    return fetchHandler(`http://localhost:8080/groups`, "POST", data)
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r) => {
            if (r.errors) throw r.errors
            return r
        })
        .catch((errArr) => {
            // navigate("/internal-error")
            fetchErrorChecker(errArr, navigate, displayErrors)
            return null
        })
}
