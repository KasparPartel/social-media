import { NavigateFunction } from "react-router-dom"
import { PostFormFields } from "../../models"

export interface CommonPostProps {
    formData: PostFormFields
    setFormData: React.Dispatch<React.SetStateAction<PostFormFields>>
    navigate?: NavigateFunction
}

export default function PostText({ formData, setFormData }: CommonPostProps) {
    return (
        <textarea
            name="text"
            onChange={(e) => handleTextChange(e, setFormData)}
            value={formData.text}
            className="post-form__text"
        />
    )
}

const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setFormData: React.Dispatch<React.SetStateAction<PostFormFields>>,
) => {
    const { name, value } = e.target
    if (name === "text") {
        setFormData((prevValues) => {
            const temp = Object.assign({}, prevValues)
            temp.text = value
            return temp
        })
        return
    }
}
