import { PostFormFields } from "../models"
import privateAddIcon from "../../assets/private_add.svg"
import privateResetIcon from "../../assets/Reset.svg"
import PrivacyOverlay from "./privacyOverlay"
import toggleHook from "../../hooks/useToggle"
import { CommonPostProps } from "./text"

export const PrivacySettings = {
    Public: 1,
    Semi: 2,
    Private: 3,
}

export function PostPrivacy({ formData, setFormData }: CommonPostProps) {
    const { toggle: overlayOpen, toggleChange: toggleOverlay } = toggleHook(false)

    return (
        <>
            <select
                name="privacy"
                value={formData.privacy}
                onChange={(e) => handlePrivacyChange(e, setFormData)}
                className="post-form__privacy"
            >
                <option value={PrivacySettings.Public}>Public</option>
                <option value={PrivacySettings.Semi}>Semi</option>
                <option value={PrivacySettings.Private}>Private</option>
            </select>

            {formData.privacy === PrivacySettings.Semi && (
                <>
                    <img
                        className="post-form__add-users-img"
                        src={
                            formData.authorizedFollowers.length > 0
                                ? privateResetIcon
                                : privateAddIcon
                        }
                        alt="add users"
                        onClick={toggleOverlay}
                    />
                    {formData.authorizedFollowers.length > 0 ? (
                        <div className="post-form__add-users-info">
                            Added {formData.authorizedFollowers.length}{" "}
                            {formData.authorizedFollowers.length > 1 ? "users" : "user"}
                        </div>
                    ) : null}
                    {overlayOpen ? (
                        <PrivacyOverlay
                            {...{
                                toggleModal: toggleOverlay,
                                setFormData,
                            }}
                        />
                    ) : null}
                </>
            )}
        </>
    )
}

const handlePrivacyChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFormData: React.Dispatch<React.SetStateAction<PostFormFields>>,
) => {
    const { name, value } = e.target
    if (name === "privacy") {
        setFormData((prevValues) => {
            const temp = Object.assign({}, prevValues)
            temp.privacy = Number(value)
            return temp
        })
        return
    }
}
