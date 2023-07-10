import "./group.css"
import useParamId from "../../hooks/useParamId"
import { useGroupInfo } from "../../hooks/useEntityInfo"
import { useNavigate } from "react-router-dom"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import { InviteButton } from "./InviteButton"
import { leaveGroup } from "../groups/fetch"
import { GroupContent } from "./GroupContent"
import { useErrorsContext } from "../error-display/ErrorDisplay"
import { Chat } from "../chat-component/Chat"

const groupJoinStatus = {
    1: "Not joined",
    2: "Reqested to join",
    3: "Joined",
}

export function GroupPage() {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const { paramId } = useParamId()
    const [group, isLoading, setGroup] = useGroupInfo(paramId)

    return (
        <>
            {isLoading ? (
                <LoadingSkeleton dataName="group page" />
            ) : group ? (
                group.joinStatus === 3 ? (
                    <div className="group__wrapper">
                        <div className="group">
                            <div className="group__info-section">
                                <p className="group__title">{group.title}</p>
                                <p className="group__description">{group.description}</p>
                                <div className="group__buttons-container  group__buttons-container_vertical">
                                    <div className="group__buttons-container">
                                        <Chat {...{ id: group.id, isGroup: true }} />
                                        <InviteButton {...{ paramId }} />
                                        {!group.isOwner && (
                                            <button
                                                onClick={() => {
                                                    leaveGroup(
                                                        paramId,
                                                        navigate,
                                                        displayErrors,
                                                        setGroup,
                                                    )
                                                }}
                                                className="button button_red group__button"
                                            >
                                                Leave
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {<GroupContent {...{ groupId: paramId }} />}
                        </div>
                    </div>
                ) : (
                    <div className="group__wrapper">
                        <div className="group group_centered">
                            <div className="group__info-section">
                                <p className="group__title">{group.title}</p>
                                <p className="group__description">{group.description}</p>
                                <p className="group__description group__descriptio_not-stretched">
                                    Your status: {groupJoinStatus[group.joinStatus]}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                navigate("/error-not-found")
            )}
        </>
    )
}
