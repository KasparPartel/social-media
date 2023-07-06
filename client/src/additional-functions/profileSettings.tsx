import {
    ProfileSettingsUpdateFormFields,
    ProfileSettingsUpdateRequestProps,
} from "../components/models"
import fetchHandler from "./fetchHandler"
import { formDataExtractor } from "./form"
import { updateImage } from "./images"

export function ProfileSettingsUpdateRequest({ e, id, avatar }: ProfileSettingsUpdateRequestProps) {
    e.preventDefault()
    const formFields: ProfileSettingsUpdateFormFields = {
        avatar: "",
        login: "",
        aboutMe: "",
        isPublic: "",
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    return updateImage(formFields, avatar)
        .then(() => fetchHandler(`http://localhost:8080/user/${id}`, "PUT", formFields))
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: status ${r.statusText}` }]
            }
            return r.json()
        })
}