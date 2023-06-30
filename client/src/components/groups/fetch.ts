import { NavigateFunction } from "react-router-dom"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import fetchHandler from "../../additional-functions/fetchHandler"
import { Group } from "../models"

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
    setJoinStatus: React.Dispatch<React.SetStateAction<number>>,
) => {
    fetchHandler(`http://localhost:8080/group/${groupId}/join`, "POST")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: status ${response.status}`)
            }
            return response.json()
        })
        .then((responseBody: joinLeaveResponse) => {
            setJoinStatus(() => responseBody.data.joinStatus)
        })
        .catch((err) => {
            fetchErrorChecker(err, navigate)
        })
}

export const leaveGroupInGroupList = (
    groupId: number,
    navigate: NavigateFunction,
    setJoinStatus?: React.Dispatch<React.SetStateAction<number>>,
) => {
    fetchHandler(`http://localhost:8080/group/${groupId}/leave`, "POST")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: status ${response.status}`)
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
            fetchErrorChecker(err, navigate)
        })
}

export const leaveGroup = (
    groupId: number,
    navigate: NavigateFunction,
    setGroup?: React.Dispatch<React.SetStateAction<Group>>,
) => {
    fetchHandler(`http://localhost:8080/group/${groupId}/leave`, "POST")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: status ${response.status}`)
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
            fetchErrorChecker(err, navigate)
        })
}
