import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUsersList } from "../../additional-functions/getUsers"
import privateUserList from "./privacyUserList"
import { PostFormFields } from "../models"

interface PrivacyOverlayProps {
    toggleModal: () => void
    setFormData: React.Dispatch<React.SetStateAction<PostFormFields>>
}

export default function PrivacyOverlay({ toggleModal, setFormData }: PrivacyOverlayProps) {
    const navigate = useNavigate()
    const userList = getUsersList({
        id: Number(localStorage.getItem("id")),
        navigate,
        endpoint: "followers",
    })
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
                            handleFollowersChange(indexList, setFormData)
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

const handleFollowersChange = (
    indexList: number[],
    setFormData: React.Dispatch<React.SetStateAction<PostFormFields>>,
) => {
    setFormData((prevValues) => {
        const temp = Object.assign({}, prevValues)
        temp.authorizedFollowers = indexList
        return temp
    })
}
