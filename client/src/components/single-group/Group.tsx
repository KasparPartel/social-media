import "./group.css"
import useParamId from "../../hooks/useParamId"
import { useGroupInfo } from "../../hooks/useEntityInfo"
import { useNavigate } from "react-router-dom"
import LoadingSkeleton from "../render-states/LoadingSkeleton"

export function GroupPage() {
    const navigate = useNavigate()
    const { paramId } = useParamId()
    const [group, isLoading] = useGroupInfo(paramId)

    return (
        <>
            {isLoading ? (
                <LoadingSkeleton dataName="group page" />
            ) : group ? (
                <div className="group__wrapper">
                    <div className="group">
                        <div className="group__info-section">
                            <p className="group__title">{group.title}</p>
                            <p className="group__description">{group.description}</p>
                            <div className="group__buttons-container  group__buttons-container_vertical">
                                <button className="button group__button">Group chat</button>
                                <div className="group__buttons-container">
                                    <button className="button group__button">Invite</button>
                                    <button className="button button_red group__button">
                                        Leave
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="group__right">Right side</div>
                    </div>
                </div>
            ) : (
                navigate("/error-not-found")
            )}
        </>
    )
}
