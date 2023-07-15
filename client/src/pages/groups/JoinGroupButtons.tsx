import { useNavigate } from "react-router-dom"
import { ReactElement, useState } from "react"
import { sendJoinRequest, leaveGroupInGroupList } from "./fetch"
import { useErrorsContext } from "../../components/error-display/ErrorDisplay"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"

interface JoinGroupButtonsProps {
    initJoinStatus: number
    isOwner: boolean
    groupId: number
}

export function JoinGroupButtons({
    initJoinStatus,
    isOwner,
    groupId,
}: JoinGroupButtonsProps): ReactElement {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const [joinStatus, setJoinStatus] = useState<number>(initJoinStatus)

    function onClickHandler(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        wantsToBeInGroup?: boolean,
    ) {
        event.preventDefault()
        switch (joinStatus) {
            case 1: // not joined
                sendJoinRequest(groupId, navigate, displayErrors, setJoinStatus)
                break
            case 2: // requested
                alert("Cancel join request endpoint/logic not added, yet")
                // sendCancelRequest(groupId, navigate, displayErrors, setJoinStatus)
                break
            case 3: // joined
                wantsToBeInGroup
                    ? navigate(`/group/${groupId}`)
                    : leaveGroupInGroupList(groupId, navigate, displayErrors, setJoinStatus)
                break
            case 4: // Invited
                wantsToBeInGroup
                    ? alert("Accept request endpoint/logic not added, yet")
                    : alert("Decline request endpoint/logic not added, yet")
                // wantsToBeInGroup ?
                //     sendAcceptRequest(groupId, navigate, displayErrors, setJoinStatus) :
                //     sendDeclineRequest(groupId, navigate, displayErrors, setJoinStatus);
                break
            default:
                fetchErrorChecker(
                    [{ code: 0, description: "Unknown/Invalid joinStatus" }],
                    navigate,
                    displayErrors,
                )
        }
    }

    if (joinStatus > 3 || joinStatus < 1) {
        ;<h1>Error: Not existing joinStatus {joinStatus}</h1>
    }

    return (
        <div className="group-interaction-list">
            {joinStatus === 1 && (
                <button
                    type="button"
                    onClick={(event) => onClickHandler(event)}
                    className="group-card__button"
                >
                    join
                </button>
            )}
            {joinStatus === 2 && (
                <button
                    type="button"
                    onClick={(event) => onClickHandler(event)}
                    className=" group-card__button group-card__button_requested"
                    disabled // Remove this if cancel request gets added
                >
                    sent/cancel
                </button>
            )}
            {joinStatus === 3 && (
                <button
                    type="button"
                    onClick={(event) => onClickHandler(event, true)}
                    className="group-card__button"
                >
                    open
                </button>
            )}
            {joinStatus === 3 && !isOwner && (
                <button
                    type="button"
                    onClick={(event) => onClickHandler(event, false)}
                    className=" group-card__button group-card__button_red"
                >
                    leave
                </button>
            )}
            {joinStatus === 4 && (
                <button
                    type="button"
                    onClick={(event) => onClickHandler(event, true)}
                    className=" group-card__button"
                >
                    accept
                </button>
            )}
            {joinStatus === 4 && (
                <button
                    type="button"
                    onClick={(event) => onClickHandler(event, false)}
                    className=" group-card__button group-card__button_red"
                >
                    decline
                </button>
            )}
            {!(joinStatus >= 1 && joinStatus <= 4) && (
                <button type="button" disabled className="groups-card-error">
                    Error: {joinStatus}
                </button>
            )}
        </div>
    )
}
