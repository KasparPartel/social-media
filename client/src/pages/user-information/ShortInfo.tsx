import { useNavigate } from "react-router-dom"
import altAvatar from "../../assets/default-avatar.png"
import settingsIcon from "../../assets/settings_icon.svg"
import toggleHook from "../../hooks/useToggle"
import { ProfileSettings } from "../../components/profile-settings/Settings"
import { User } from "../../models"
import "./short-info.css"

interface shortInfoProps {
    user: User
    isMyProfile: boolean
    openText: () => void
    height: number
    setUser: React.Dispatch<React.SetStateAction<User>>
}

export default function ShortInfo({
    user,
    isMyProfile,
    openText,
    height,
    setUser,
}: shortInfoProps) {
    const avatarImg = user.avatar !== "" ? user.avatar : altAvatar
    const { toggle: toggleProfileSettings, toggleChange } = toggleHook(false)
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
                            {toggleProfileSettings ? (
                                <ProfileSettings
                                    {...{
                                        user,
                                        setUser,
                                        navigate,
                                        toggleChange,
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
