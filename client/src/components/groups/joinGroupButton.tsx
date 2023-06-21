import { useNavigate, useParams } from "react-router-dom"
import fetchHandler from "../../additional-functions/fetchHandler";
import { useState } from "react";
import { sendJoinRequest } from "./fetch";

export function JoinGroupButton({ initJoinStatus, groupId }: {
  initJoinStatus: number,
  groupId: number,
}): React.JSX.Element {
  const navigate = useNavigate()

  const [joinStatus, setJoinStatus] = useState<number>(initJoinStatus);

  function onClickHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    switch (joinStatus) {
      case 1:
        sendJoinRequest(groupId, setJoinStatus)
        break;
      case 2:
        break;
      case 3:
        // navigate to the group page
        navigate(`/group/:${groupId}`)
        break;
      default:
        alert("unknown joinStatus: joinStatus: " + joinStatus);
    }

  }

  return (
    <>
      {joinStatus === 1 && <button onClick={(event) => onClickHandler(event)} className="group-card-button">join</button>}
      {joinStatus === 2 && <button onClick={(event) => onClickHandler(event)} className="group-card-button" disabled>sent</button>}
      {joinStatus === 3 && <button onClick={(event) => onClickHandler(event)} className="group-card-button">open</button>}
      {!(joinStatus >= 1 && joinStatus <= 3) && <button disabled className="groups-list-item-error">Err: statusCode undefined, statusCode: {joinStatus}</button>}
    </>
  )
}