import { useState } from "react"
import toggleHook from "../../hooks/useToggle"
import PrivacyOverlay from "../create-post/PrivacyOverlay"
import fetchHandler from "../../additional-functions/fetchHandler"
import { getUsersList } from "../../additional-functions/getUsers"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { useNavigate } from "react-router-dom"

interface InviteButtonParam {
    paramId: number
}

export function InviteButton({ paramId }: InviteButtonParam) {
    const navigate = useNavigate()
    const { toggle: overlayOpen, toggleChange: toggleOverlay } = toggleHook(false)
    const [indexList, setIndexList] = useState<number[]>([])
    const userList = getUsersList({
        id: Number(localStorage.getItem("id")),
        endpoint: "followers",
    })

    return (
        <>
            <button onClick={toggleOverlay} className="button group__button">
                Invite
            </button>
            {overlayOpen ? (
                <PrivacyOverlay
                    {...{
                        toggleModal: toggleOverlay,
                        indexList,
                        setIndexList,
                        userList,
                    }}
                >
                    <button
                        className="button"
                        type="button"
                        onClick={() => {
                            fetchHandler(`http://localhost:8080/group/${paramId}/invite`, "POST", {
                                users: indexList.map((userIndex) => userList[userIndex].id),
                            })
                                .then((r) => r.json())
                                .then((r) => {
                                    if (r.errors) fetchErrorChecker(r.errors, navigate)
                                    if (r.data.users.length === 0) alert("No users invited")
                                    if (r.data.users.length > 0)
                                        alert(
                                            `${r.data.users.length} ${
                                                r.data.users.length === 1 ? "user" : "users"
                                            } invited`,
                                        )
                                })
                            setIndexList([])
                            toggleOverlay()
                        }}
                    >
                        Invite
                    </button>
                </PrivacyOverlay>
            ) : null}
        </>
    )
}
