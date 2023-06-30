import { useNavigate, useParams } from "react-router-dom"
import fetchHandler from "../../additional-functions/fetchHandler"
import { useState } from "react"
import { sendJoinRequest, leaveGroupInGroupList } from "./fetch"

export function JoinGroupButtons({
  initJoinStatus,
  isOwner,
  groupId,
}: {
  initJoinStatus: number
  isOwner: boolean
  groupId: number
}): React.JSX.Element {
  const navigate = useNavigate()

  const [joinStatus, setJoinStatus] = useState<number>(initJoinStatus)

  function onClickHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    switch (joinStatus) {
      case 1: // not joined
        sendJoinRequest(groupId, navigate, setJoinStatus)
        break
      case 2: // requested
        // cancel request can be here if we want it
        break
      case 3: // open
        navigate(`/group/${groupId}`)
        break
      default:
        alert("unknown joinStatus: joinStatus: " + joinStatus)
    }
  }

  function leaveGroupHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    leaveGroupInGroupList(groupId, navigate, setJoinStatus)
  }

  if (joinStatus > 3 || joinStatus < 1) {
    <h1>Error: Not existing joinStatus {joinStatus}</h1>
  }

  return (
    <div className="group-interaction-list">
      {joinStatus === 1 && (
        <button type="button" onClick={(event) => onClickHandler(event)} className="group-card__button">
          join
        </button>
      )}
      {joinStatus === 2 && (
        <button type="button"
          onClick={(event) => onClickHandler(event)}
          className=" group-card__button group-card__button_requested"
          disabled
        >
          sent
        </button>
      )}
      {joinStatus === 3 && (
        <button type="button" onClick={(event) => onClickHandler(event)} className="group-card__button">
          open
        </button>
      )}
      {joinStatus === 3 && !isOwner && (
        <button type="button"
          onClick={(event) => leaveGroupHandler(event)}
          className=" group-card__button group-card__button_leave"
        >
          leave
        </button>
      )}
      {!(joinStatus >= 1 && joinStatus <= 3) && (
        <button type="button" disabled className="groups-card-error">
          Error: {joinStatus}
        </button>
      )}
    </div>
  )
}
