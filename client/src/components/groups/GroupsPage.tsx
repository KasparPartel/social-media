import { useEffect, useState } from "react"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import fetchHandler from "../../additional-functions/fetchHandler"
import "./groups.css"
import { JoinGroupButtons } from "./JoinGroupButtons"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { Group } from "../models"
import { ErrorsDisplayType, useErrorsContext } from "../error-display/ErrorDisplay"
import CreateGroup from "../create-group/CreateGroup"

export function GroupsPage() {
    const navigate = useNavigate()
    const { displayErrors } = useErrorsContext()

    const [isLoading, setLoading] = useState(true)
    const [groupList, setGroupList] = useState<Group[]>([])

    useEffect(() => {
        getAllGroups(setGroupList, setLoading, navigate, displayErrors)
    }, [isLoading])

    if (isLoading) return <LoadingSkeleton dataName="groups" />

    if (groupList.length === 0) {
        return (
            <div className="groups-empty-display">
                <p>No Groups, yet!</p>
                <CreateGroup />
            </div>
        )
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
    displayErrors: ErrorsDisplayType,
) {
    fetchHandler(`http://localhost:8080/groups`, "GET")
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r) => {
            if (r.errors) throw r.errors
            setGroupList(r.data)
            setLoading(() => false)
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
            setLoading(false)
        })
}
