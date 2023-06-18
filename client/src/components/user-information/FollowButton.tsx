import { followRequest } from "../../additional-functions/follow"
import { followProps } from "./UserInformation"

interface followButtonProps {
    id: number
    followPorps: followProps
    setFollowPorps: (arg: followProps) => void
}

export default function FollowButton({ id, followPorps, setFollowPorps }: followButtonProps) {
    return (
        <button
            onClick={() => followRequest(id, setFollowPorps)}
            className={"button " + followPorps.followClass}
        >
            {followPorps.followText}
        </button>
    )
}
