import { NavigateFunction } from "react-router-dom"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import fetchHandler from "../../additional-functions/fetchHandler"
import { Group } from "../models"
import { ErrorsDisplayType } from "../error-display/ErrorDisplay"

type joinLeaveResponse = {
    data: {
        joinStatus: number // 1 - not joined, 2 - requested, 3 - joined
    }
    errors: {
        code: number
        description: string
    }[]
}

export const sendJoinRequest = (
    groupId: number,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
    setJoinStatus: React.Dispatch<React.SetStateAction<number>>
) => {
    fetchHandler(`http://localhost:8080/group/${groupId}/join`, "POST")
        .then((r) => {
            if (!r.ok) {
                throw [{ code: r.status, description: `HTTP error: status ${r.statusText}` }]
            }
            return r.json()
        })
        .then((r: joinLeaveResponse) => {
            if (r.errors) {
                throw r.errors
            }
            setJoinStatus(() => r.data.joinStatus)
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
        })
}

export const leaveGroupInGroupList = (
    groupId: number,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
    setJoinStatus?: React.Dispatch<React.SetStateAction<number>>
) => {
    fetchHandler(`http://localhost:8080/group/${groupId}/leave`, "POST")
        .then((response) => {
            if (!response.ok) {
                throw [{ code: response.status, description: `HTTP error: status ${response.statusText}` }]
            }
            return response.json()
        })
        .then((responseBody: joinLeaveResponse) => {
            if (setJoinStatus) {
                setJoinStatus(() => responseBody.data.joinStatus)
            }
            return responseBody.data.joinStatus
        })
        .catch((err) => {
            fetchErrorChecker(err, navigate, displayErrors)
        })
}

export const leaveGroup = (
    groupId: number,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
    setGroup?: React.Dispatch<React.SetStateAction<Group>>
) => {
    fetchHandler(`http://localhost:8080/group/${groupId}/leave`, "POST")
        .then((response) => {
            if (!response.ok) {
                throw [{ code: response.status, description: `HTTP error: status ${response.statusText}` }]
            }
            return response.json()
        })
        .then((responseBody: joinLeaveResponse) => {
            setGroup((prev) => {
                const temp = Object.assign({}, prev)
                temp.joinStatus = responseBody.data.joinStatus
                return temp
            })
        })
        .catch((err) => {
            fetchErrorChecker(err, navigate, displayErrors)
        })
}