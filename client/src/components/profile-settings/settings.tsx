import "./settings.css"
import { useState } from "react"
import { ImageUpload } from "../../additional-functions/images"
import avatar_deafult from "../../assets/default-avatar.png"
import { ProfileSettingsUpdateRequest } from "../../additional-functions/authorization"
import { NavigateFunction } from "react-router-dom"

interface ProfileSettingsProps {
    id: number
    navigate: NavigateFunction
    toggleChange: () => void
    avatar?: string
    login?: string
    aboutMe?: string
    isPublic?: boolean
}

export function ProfileSettings({
    id,
    navigate,
    toggleChange,
    avatar,
    login,
    aboutMe,
    isPublic,
}: ProfileSettingsProps) {
    const [currentAvatar, setCurrentAvatar] = useState<Blob>(null)
    const [aboutMeText, setAboutMeText] = useState<string>(aboutMe)
    const [loginText, setLoginText] = useState<string>(login)

    return (
        <div className="settings__wrapper">
            <form
                className="settings"
                onSubmit={(e) => {
                    ProfileSettingsUpdateRequest({ e, id, navigate, avatar: currentAvatar }).then(
                        (r) => {
                            if (r === null) {
                                window.location.reload()
                            } else {
                                console.log(r)
                            }
                        },
                    )
                }}
            >
                <div className="settings__container">
                    <p className="settings__title">Account settings</p>
                    <div className="settings__button-container">
                        <button type="submit" className="settings__button button form__button">
                            Save changes
                        </button>
                        <button
                            type="button"
                            onClick={toggleChange}
                            className="settings__button settings__button_orange button form__button"
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
                    <label className="settings__input-label">
                        Bio
                        <textarea
                            rows={6}
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
                                : avatar_deafult
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
