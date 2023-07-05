import { useEffect, useState } from "react"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import fetchHandler from "../../additional-functions/fetchHandler"
import "./groups.css"
import { JoinGroupButtons } from "./JoinGroupButtons"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { Group } from "../models"
import CreateGroup from "../create-group/CreateGroup"

export function GroupsPage() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true)
    const [groupList, setGroupList] = useState<Group[]>([])

    useEffect(() => {
        getAllGroups(setGroupList, setLoading, navigate)
    }, [isLoading])

    if (isLoading) return <LoadingSkeleton dataName="groups" />

    if (groupList.length === 0) {
        return <p>No Groups, yet!</p>
    }

    return (
        <main className="groups-main">
            <div className="create-group__button_wrapper">
                <CreateGroup />
            </div>
            <div className="group-list">
                {groupList.map((group, key) => {
                    return (
                        <div className="group-card" key={key}>
                            <span className="group-card__title">{group.title}</span>
                            <span className="group-card__space"></span>
                            <JoinGroupButtons
                                initJoinStatus={group.joinStatus}
                                isOwner={group.isOwner}
                                groupId={group.id}
                            />
                        </div>
                    )
                })}
            </div>
        </main>
    )
}

function getAllGroups(
    setGroupList: React.Dispatch<React.SetStateAction<Group[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction,
) {
    fetchHandler(`http://localhost:8080/groups`, "GET")
        .then((r) => r.json())
        .then((response) => {
            if (response.errors) throw response.errors
            setGroupList(response.data)
            setLoading(() => false)
        })
        .catch((err) => {
            fetchErrorChecker(err, navigate)
            setLoading(false)
        })
}
