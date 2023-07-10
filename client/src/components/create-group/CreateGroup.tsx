import "./createGroup.css"
import React, { useState } from "react"
import fetchHandler from "../../additional-functions/fetchHandler"
import { MakeGroupFormFields } from "../models"
import { NavigateFunction, useNavigate } from "react-router-dom"

const defaultGroupFormData: MakeGroupFormFields = {
    title: "",
    description: "",
}
export default function CreateGroup() {
    const [isFormOpen, setFormOpen] = React.useState(false)
    const [formData, setFormData] = useState<MakeGroupFormFields>(defaultGroupFormData)
    const navigate = useNavigate()

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
                                handleSubmit(formData, navigate).then((r) => {
                                    if (r) {
                                        setFormOpen(false)
                                        setFormData(defaultGroupFormData)
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

function handleSubmit(data: MakeGroupFormFields, navigate: NavigateFunction): Promise<boolean> {
    return fetchHandler(`http://localhost:8080/groups`, "POST", data)
        .then((r) => r.json())
        .then((r) => {
            if (r.errors) {
                r.errors.forEach((err) => alert(`Problem creating group: ${err.description}`))
                return false
            }
            alert(`${data.title} has been created`)
            return true
        })
        .catch(() => {
            navigate("/internal-error")
            return false
        })
}
