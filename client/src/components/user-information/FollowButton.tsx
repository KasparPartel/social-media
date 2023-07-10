import { useNavigate } from "react-router-dom"
import { followRequest } from "../../additional-functions/follow"
import { followProps } from "./UserInformation"
import { useErrorsContext } from "../error-display/ErrorDisplay"

interface followButtonProps {
    id: number
    followPorps: followProps
    setFollowPorps: (arg: followProps) => void
}

export default function FollowButton({ id, followPorps, setFollowPorps }: followButtonProps) {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    return (
        <button
            onClick={() => followRequest(id, setFollowPorps, navigate, displayErrors)}
            className={"button " + followPorps.followClass}
        >
            {followPorps.followText}
        </button>
    )
}
