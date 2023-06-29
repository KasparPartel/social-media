import { PostFormFields, User } from "../models"
import privateAddIcon from "../../assets/private_add.svg"
import privateResetIcon from "../../assets/Reset.svg"
import PrivacyOverlay from "./PrivacyOverlay"
import toggleHook from "../../hooks/useToggle"
import { CommonPostProps } from "./PostText"
import { useState } from "react"
import { getUsersList } from "../../additional-functions/getUsers"

export const PrivacySettings = {
    Public: 1,
    Semi: 2,
    Private: 3,
}

export function PostPrivacy({ formData, setFormData }: CommonPostProps) {
    const { toggle: overlayOpen, toggleChange: toggleOverlay } = toggleHook(false)
    const [indexList, setIndexList] = useState<number[]>([])
    const userList = getUsersList({
        id: Number(localStorage.getItem("id")),
        endpoint: "followers",
    })

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
                                indexList,
                                setIndexList,
                                userList,
                            }}
                        >
                            <button
                                className="button"
                                type="button"
                                onClick={() => {
                                    handleFollowersChange(indexList, userList, setFormData)
                                    toggleOverlay()
                                }}
                            >
                                Continue
                            </button>
                        </PrivacyOverlay>
                    ) : null}
                </>
            )}
        </>
    )
}

const handleFollowersChange = (
    indexList: number[],
    userList: User[],
    setFormData: React.Dispatch<React.SetStateAction<PostFormFields>>,
) => {
    setFormData((prevValues) => {
        const temp = Object.assign({}, prevValues)
        temp.authorizedFollowers = indexList.map((userIndex) => userList[userIndex].id)
        return temp
    })
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
