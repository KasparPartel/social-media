import { useEffect, useState } from "react"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import fetchHandler from "../../additional-functions/fetchHandler"
import "./groups.css"
import { JoinGroupButtons } from "./joinGroupButtons"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { NavigateFunction, useNavigate } from "react-router-dom"

export type groupsFetchData = {
    id: number // group id
    title: string // group title
    joinStatus: number // 1 - not joined, 2 - requested, 3 - joined
    isOwner: boolean
}

export type fetchErrorsData = {
    code: number
    description: string
}

export type fetchGroupsResponse = {
    data: groupsFetchData[]
    errors: fetchErrorsData[]
}

export function GroupsPage() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true)
    const [groupList, setGroupList] = useState<groupsFetchData[]>([])

    useEffect(() => {
        getAllGroups(setGroupList, setLoading, navigate)
    }, [isLoading])

    if (isLoading) return <LoadingSkeleton dataName="groups" />

    if (groupList.length === 0) {
        return <p>No Groups, yet!</p>
    }

    return (
        <main id="groups-main">
            <div className="create-group__button_wrapper">
                <button type="button" className="create-group__button">
                    Create New Group
                </button>
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
    setGroupList: React.Dispatch<React.SetStateAction<groupsFetchData[]>>,
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
