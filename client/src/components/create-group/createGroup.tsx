import "./createGroup.css"
import React, { useState } from "react"
import fetchHandler from "../../additional-functions/fetchHandler"
import { MakeGroupFormFields } from "../models"
export default function CreateGroup() {
    const [popup, setPopup] = React.useState(true)
    const OGdata: MakeGroupFormFields = {
        title: "",
        description: ""
    }

    const [formData, setFormData] = useState<MakeGroupFormFields>(OGdata)
    return(
        <>
            {popup ? (
                
                <input 
                
                    type="button"
                    className="create button"
                    value="CREATE NEW GROUP"
                    onClick={() => setPopup(false)}/>
                ) : (

                    <form className="create-group-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit(formData)
                            setPopup(true)
                            setFormData(OGdata)
                        }}
                    >
                        <input
                            
                            className="create-group-form__title"
                            placeholder="TITLE"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    ["title"]: e.target.value
                                }))
                            }}
                        />
                        <textarea
                            rows={5}
                            cols={5}
                            className="create-group-form__disc"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    ["description"]: e.target.value
                                }))
                            }}
                        />

                        
                        <div className="buttons">
                            <input
                                type="button"
                                className="create-group-form__cancel button"
                                value="CANCEL"

                                onClick={() => {
                                    setPopup(true)
                                    setFormData(OGdata)
                                }}
                            />
                            <input
                                type="submit"
                                className="create-group-form__submit button"
                                value="SUBMIT"
                            />
                        </div>

                    </form>
                )
            }
        </>
    )
}


function handleSubmit(data: MakeGroupFormFields) {

    fetchHandler(
        `http://localhost:8080/groups`,
        "POST",
        data
    )  .then((r) => r.json())
    .then((r) => {
        if (r.errors) {
            console.log(r.errors)
            r.errors.forEach(err => alert(`Problem creating group: ${err.description}`))
            return
        }
        alert(`${data.title} has been created`)
        console.log(r.data)
    })
}