import "./settings.css"
import { useState } from "react"
import { ImageUpload } from "../../additional-functions/images"
import avatar_default from "../../assets/default-avatar.png"
import { ProfileSettingsUpdateRequest } from "../../additional-functions/profileSettings"
import { useNavigate } from "react-router-dom"
import { User } from "../models"
import { useErrorsContext } from "../error-display/ErrorDisplay"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"

interface ProfileSettingsProps {
    user: User
    setUser: React.Dispatch<React.SetStateAction<User>>
    toggleChange: () => void
}

export function ProfileSettings({
    user: { id, login, aboutMe, avatar, isPublic },
    setUser,
    toggleChange,
}: ProfileSettingsProps) {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const [currentAvatar, setCurrentAvatar] = useState<Blob>(null)
    const [aboutMeText, setAboutMeText] = useState<string>(aboutMe)
    const [loginText, setLoginText] = useState<string>(login)

    return (
        <div className="settings__wrapper">
            <form
                className="settings"
                onSubmit={(e) => {
                    ProfileSettingsUpdateRequest({ e, id, avatar: currentAvatar })
                        .then((r) => {
                            if (r.errors) throw r.errors

                            setUser((prevValue) => {
                                const temp = Object.assign({}, prevValue)
                                Object.entries(r.data).forEach(([key, value]) => {
                                    if (Object.hasOwn(temp, key)) {
                                        temp[key] = value
                                    }
                                })

                                return temp
                            })
                        }).catch((errArr) => {
                            fetchErrorChecker(errArr, navigate, displayErrors)
                            // navigate("/internal-error")
                        })
                        .finally(toggleChange)
                }}
            >
                <div className="settings__container">
                    <p className="settings__title">Account settings</p>
                    <div className="settings__button-container">
                        <button type="submit" className="settings__button button">
                            Save changes
                        </button>
                        <button
                            type="button"
                            onClick={toggleChange}
                            className="settings__button button button_orange"
                        >
                            Cancel
                        </button>
                    </div>
                    <label className="settings__input-label">
                        Username
                        <input
                            className="form__field"
                            name="login"
                            placeholder="Username"
                            type="text"
                            value={loginText}
                            onChange={(e) => setLoginText(e.target.value)}
                        />
                    </label>
                    <label style={{ height: "100%" }} className="settings__input-label">
                        Bio
                        <textarea
                            className="settings__textarea form__field"
                            name="aboutMe"
                            placeholder="Bio here"
                            value={aboutMeText}
                            onChange={(e) => setAboutMeText(e.target.value)}
                        />
                    </label>
                    <label className="settings__radio-label settings__radio-label_big-font">
                        Privacy:
                        <label className="settings__radio-label">
                            <input
                                className="settings__radio"
                                type="radio"
                                name="isPublic"
                                value="true"
                                {...(isPublic && { defaultChecked: true })}
                            />
                            Public
                        </label>
                        <label className="settings__radio-label">
                            <input
                                className="settings__radio"
                                type="radio"
                                name="isPublic"
                                value="false"
                                {...(!isPublic && { defaultChecked: true })}
                            />
                            Private
                        </label>
                    </label>
                </div>
                <div className="settings__avatar-container">
                    <img
                        className="settings__avatar-img"
                        src={
                            currentAvatar
                                ? URL.createObjectURL(currentAvatar)
                                : avatar
                                    ? avatar
                                    : avatar_default
                        }
                        alt="attachment"
                    />
                    <label className="button form__button form__button_with-label">
                        Change avatar
                        <input
                            name="avatar"
                            style={{ display: "none" }}
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => ImageUpload(e, setCurrentAvatar)}
                        />
                    </label>
                </div>
            </form>
        </div>
    )
}
