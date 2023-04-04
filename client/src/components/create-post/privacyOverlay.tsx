import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUsersList } from "../../additional-functions/getUsers"
import privateUserList from "./privacyUserList"

interface PrivacyOverlayProps {
    toggleModal: () => void
    userId: number
    setAllowedUsers: (arg: number[]) => void
}

export default function PrivacyOverlay({
    toggleModal,
    userId,
    setAllowedUsers,
}: PrivacyOverlayProps) {
    const navigate = useNavigate()
    const userList = getUsersList({ userId, navigate, endpoint: "followers" })
    const [indexList, setIndexList] = useState<number[]>([])

    return (
        <div className="add-users">
            <div className="add-users__wrapper">
                <div className="add-users__scroll">
                    {privateUserList(userList, indexList, setIndexList)}
                </div>
                <div className="add-users__button-container">
                    <button className="button" type="button" onClick={toggleModal}>
                        Close
                    </button>
                    <button
                        className="button"
                        type="button"
                        onClick={() => {
                            setAllowedUsers(
                                userList
                                    .filter((_, i) => indexList.includes(i))
                                    .map((user) => user.id),
                            )
                            toggleModal()
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}
