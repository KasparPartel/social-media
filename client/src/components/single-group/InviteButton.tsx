import { useState } from "react"
import toggleHook from "../../hooks/useToggle"
import PrivacyOverlay from "../create-post/PrivacyOverlay"
import fetchHandler from "../../additional-functions/fetchHandler"
import { getUsersList } from "../../additional-functions/getUsers"

interface InviteButtonParam { paramId: number }

export function InviteButton({ paramId }: InviteButtonParam) {
    const { toggle: overlayOpen, toggleChange: toggleOverlay } = toggleHook(false)
    const [indexList, setIndexList] = useState<number[]>([])
    const userList = getUsersList({
        id: Number(localStorage.getItem("id")),
        endpoint: "followers",
    })

    return (
        <>
            <button
                onClick={toggleOverlay}
                className="button group__button">Invite</button>
            {overlayOpen ? (
                <PrivacyOverlay
                    {...{
                        toggleModal: toggleOverlay,
                        indexList,
                        setIndexList,
                        userList
                    }}
                >
                    <button
                        className="button"
                        type="button"
                        onClick={() => {
                            fetchHandler(
                                `http://localhost:8080/group/${paramId}/invite`, "POST", { users: indexList.map(userIndex => userList[userIndex].id) }
                            ).then(r => r.json()).then(console.log)
                            setIndexList([])
                            toggleOverlay()
                        }}
                    >
                        Invite
                    </button>
                </PrivacyOverlay>) : null
            }
        </>
    )
}
