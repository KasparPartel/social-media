import { ProfileSettingsUpdateFormFields } from "../models"

export function ImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: Blob) => void,
) {
    if (!e.target.files) return
    setImage(e.target.files[0])
}

export async function updateImage(formFields: ProfileSettingsUpdateFormFields, image: Blob) {
    if (image === null) {
        delete formFields.avatar
        return
    }
    await toBase64(image)
        .then((r) => {
            formFields.avatar = r
        })
        .catch(console.log)
}

export async function toBase64(file: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result?.toString() || "")
        reader.onerror = (error) => reject(error)
    })
}
