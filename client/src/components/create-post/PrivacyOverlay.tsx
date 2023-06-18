import { useNavigate } from "react-router-dom"
import { getUsersList } from "../../additional-functions/getUsers"
import privateUserList from "./PrivacyUserList"
import { PostFormFields } from "../models"
import { ProfilePlaceholders } from "../followers-following/FollowingFollowers"

interface PrivacyOverlayProps {
    toggleModal: () => void
    setFormData: React.Dispatch<React.SetStateAction<PostFormFields>>
    indexList: number[]
    setIndexList: (arg: number[]) => void
}

export default function PrivacyOverlay({
    toggleModal,
    setFormData,
    indexList,
    setIndexList,
}: PrivacyOverlayProps) {
    const navigate = useNavigate()
    const userList = getUsersList({
        id: Number(localStorage.getItem("id")),
        navigate,
        endpoint: "followers",
    })

    return (
        <div className="add-users">
            <div className="add-users__wrapper">
                <div className="add-users__scroll">
                    {userList.length === 0
                        ? ProfilePlaceholders.noFollowers
                        : privateUserList(userList, indexList, setIndexList)}
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
