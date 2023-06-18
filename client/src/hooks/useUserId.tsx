import { useParams } from "react-router-dom"

export default function useUserId() {
    const { paramId } = useParams()
    if (!Number(paramId)) return { paramId: 0, isMyProfile: false }

    const isMyProfile = localStorage.getItem("id") === paramId
    return { paramId: Number(paramId), isMyProfile }
}
