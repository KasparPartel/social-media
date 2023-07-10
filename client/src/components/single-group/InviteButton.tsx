import { useState } from "react"
import toggleHook from "../../hooks/useToggle"
import PrivacyOverlay from "../create-post/PrivacyOverlay"
import fetchHandler from "../../additional-functions/fetchHandler"
import { getUsersList } from "../../additional-functions/getUsers"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { useNavigate } from "react-router-dom"
import { useErrorsContext } from "../error-display/ErrorDisplay"

interface InviteButtonParam {
    paramId: number
}

export function InviteButton({ paramId }: InviteButtonParam) {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

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
                                .then((r) => {
                                    if (!r.ok) {
                                        throw [
                                            {
                                                code: r.status,
                                                description: `HTTP error: status ${r.statusText}`,
                                            },
                                        ]
                                    }
                                    return r.json()
                                })
                                .then((r) => {
                                    if (r.errors) throw r.errors
                                    if (r.data.users.length === 0)
                                        throw [{ code: 0, description: "No users invited" }]
                                })
                                .catch((errArr) => {
                                    fetchErrorChecker(errArr, navigate, displayErrors)
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
