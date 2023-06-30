import PrivateUserList from "./PrivateUserList"
import { User } from "../models"
import { ProfilePlaceholders } from "../followers-following/FollowingFollowers"
import { ReactNode } from "react"

interface PrivacyOverlayProps {
    toggleModal: () => void
    indexList: number[]
    setIndexList: (arg: number[]) => void
    userList: User[]
    children: ReactNode
}

export default function PrivacyOverlay({
    toggleModal,
    indexList,
    setIndexList,
    userList,
    children,
}: PrivacyOverlayProps) {
    return (
        <div className="add-users">
            <div className="add-users__wrapper">
                <div className="add-users__scroll">
                    {userList.length === 0
                        ? ProfilePlaceholders.noFollowers
                        : PrivateUserList(userList, indexList, setIndexList)}
                </div>
                <div className="add-users__button-container">
                    <button
                        className="button"
                        type="button"
                        onClick={() => {
                            setIndexList([])
                            toggleModal()
                        }}
                    >
                        Close
                    </button>
                    {children}
                </div>
            </div>
        </div>
    )
}
