import moment from "moment"
import { EventStatus, GroupFetchedEvent } from "../models"
import "./event.css"
import useUserInfo from "../../hooks/useEntityInfo"
import fetchHandler from "../../additional-functions/fetchHandler"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { NavigateFunction } from "react-router-dom"

interface GroupEventProp {
    groupEvent: GroupFetchedEvent
    navigate: NavigateFunction
}

export function GroupEvent({ groupEvent, navigate }: GroupEventProp) {
    const [user] = useUserInfo(groupEvent.userId)

    function onClickHandler(eventStatus: EventStatus) {
        fetchHandler(`http://localhost:8080/event/${groupEvent.id}/action`, "POST", eventStatus)
            .then((r) => r.json())
            .then((r) => {
                if (r.errors.length > 0) throw r.errors
            })
            .catch((err) => fetchErrorChecker(err, navigate))
    }

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
                        onClick={() => onClickHandler({ isGoing: true })}
                        className={`event__button event__button_left ${
                            groupEvent.isGoing === 3
                                ? "button_green event__button_disabled"
                                : "button_gray"
                        }`}
                    >
                        GOING
                    </button>
                    <button
                        type="button"
                        onClick={() => onClickHandler({ isGoing: false })}
                        className={`event__button event__button_right ${
                            groupEvent.isGoing === 2
                                ? "button_red event__button_disabled"
                                : "button_gray"
                        }`}
                    >
                        NOT GOING
                    </button>
                </div>
            </div>
        </article>
    )
}
