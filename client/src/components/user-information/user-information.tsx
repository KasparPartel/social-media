import { useParams } from "react-router-dom"
import { useOpenText } from "../../hooks/openText"
import useUserId from "../../hooks/userId"
import useUserInfo from "../../hooks/userInfo"
import { userProfile, userProfilePrivate, noSuchUser } from "./templates"
import "./user-information.css"

export function UserInfo() {
    const { paramId } = useParams()
    const myProfile = useUserId(paramId)
    const user = useUserInfo(paramId)
    const { height, style, refText, openText } = useOpenText(0)

    if (!user) return noSuchUser()

    if (!myProfile && !user.isPublic) return userProfilePrivate()

    return userProfile({ user, myProfile, height, style, refText, openText })
}
