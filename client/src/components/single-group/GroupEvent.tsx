import moment from "moment"
import { EventStatus, GroupFetchedEvent } from "../models"
import "./event.css"
import useUserInfo from "../../hooks/useEntityInfo"
import fetchHandler from "../../additional-functions/fetchHandler"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { useState } from "react"
import { ErrorsDisplayType, useErrorsContext } from "../error-display/ErrorDisplay"

interface GroupEventProp {
    groupEvent: GroupFetchedEvent
}

export function GroupEvent({ groupEvent }: GroupEventProp) {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()
    const [user] = useUserInfo(groupEvent.userId)
    const [isGoing, setIsGoing] = useState(groupEvent.isGoing)

    return (
        <article className="post post_darker-gray event_aligned">
            <p className="post__info event__info_grid">
                {user ? `${user.login ? user.login : `${user.firstName} ${user.lastName}`}` : null}
                <span className="post__info__date event__date_right-side">
                    {moment(groupEvent.datetime).format("YYYY-MM-DD")}
                </span>
            </p>
            <p className="event__title">{groupEvent.title}</p>
            <p className="post__text">{groupEvent.text}</p>
            <div>
                <div className="event__button-wrapper">
                    <button
                        type="button"
                        onClick={() =>
                            onClickHandler({
                                eventStatus: { isGoing: isGoing === 3 ? 1 : 3 },
                                id: groupEvent.id,
                                setIsGoing,
                                navigate,
                                displayErrors,
                            })
                        }
                        className={`event__button event__button_left ${
                            isGoing === 3 ? "button_green" : "button_gray"
                        }`}
                    >
                        GOING
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            onClickHandler({
                                eventStatus: { isGoing: isGoing === 2 ? 1 : 2 },
                                id: groupEvent.id,
                                setIsGoing,
                                navigate,
                                displayErrors,
                            })
                        }
                        className={`event__button event__button_right ${
                            isGoing === 2 ? "button_red" : "button_gray"
                        }`}
                    >
                        NOT GOING
                    </button>
                </div>
            </div>
        </article>
    )
}

interface hahah {
    eventStatus: EventStatus
    id: number
    setIsGoing: React.Dispatch<React.SetStateAction<number>>
    navigate: NavigateFunction
    displayErrors: ErrorsDisplayType
}

function onClickHandler({ eventStatus, id, setIsGoing, navigate, displayErrors }: hahah) {
    fetchHandler(`http://localhost:8080/event/${id}/action`, "POST", eventStatus)
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: status ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r) => {
            if (r.errors) throw r.errors
            setIsGoing(r.data.isGoing)
        })
        .catch((err) => fetchErrorChecker(err, navigate, displayErrors))
}
