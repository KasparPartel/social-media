import { useNavigate } from "react-router-dom"
import altAvatar from "../../assets/default-avatar.png"
import settingsIcon from "../../assets/settings_icon.svg"
import toggleHook from "../../hooks/useToggle"
import { ProfileSettings } from "../profile-settings/settings"
import { User } from "../models"

interface shortInfoProps {
    user: User
    isMyProfile: boolean
    openText: () => void
    height: number
}

export default function ShortInfo({ user, isMyProfile, openText, height }: shortInfoProps) {
    const avatarImg = user.avatar !== "" ? user.avatar : altAvatar
    const { toggle, toggleChange } = toggleHook(false)
    const navigate = useNavigate

    return (
        <div className="short-info">
            <img className="short-info__avatar" src={avatarImg} alt="avatar" />
            <div className="short-info__name">{`${user.firstName} ${user.lastName}`}</div>
            {user.isPublic || isMyProfile || user.followStatus == 3 ? (
                <>
                    <button
                        className="button"
                        onClick={() => {
                            openText()
                        }}
                    >
                        {height > 0 ? "Less information ↑" : "More information ↓"}
                    </button>
                    {isMyProfile ? (
                        <>
                            <img
                                onClick={toggleChange}
                                src={settingsIcon}
                                style={{ cursor: "pointer" }}
                                alt="settings"
                            />
                            {toggle ? (
                                <ProfileSettings
                                    {...{
                                        id: user.id,
                                        navigate,
                                        toggleChange,
                                        avatar: user.avatar,
                                        login: user.login,
                                        aboutMe: user.aboutMe,
                                        isPublic: user.isPublic,
                                    }}
                                />
                            ) : null}
                        </>
                    ) : null}
                </>
            ) : (
                <div className="short-info__privacy">Private profile</div>
            )}
        </div>
    )
}
