import fetchHandler from "../../additional-functions/fetchHandler"

type joinLeaveResponse = {
  data: {
    joinStatus: number // 1 - not joined, 2 - requested, 3 - joined
  }
  errors: {
    code: number,
    description: string
  }[]
}

export const sendJoinRequest = (
  groupId: number,
  setJoinStatus: React.Dispatch<React.SetStateAction<number>>,
) => {
  fetchHandler(`http://localhost:8080/group/${groupId}/join`, "PUT").then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: status ${response.status}`)
    }
    return response.json()
  }).then((responseBody: joinLeaveResponse) => {
    console.log(JSON.stringify(responseBody));
    setJoinStatus(() => responseBody.data.joinStatus);
  })
}

export const sendLeaveRequest = (
  groupId: number,
  setJoinStatus: React.Dispatch<React.SetStateAction<number>>,
) => {
  fetchHandler(`http://localhost:8080/group/${groupId}/leave`, "PUT").then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: status ${response.status}`)
    }
    return response.json()
  }).then((responseBody: joinLeaveResponse) => {
    console.log(JSON.stringify(responseBody));
    setJoinStatus(() => responseBody.data.joinStatus);
  })
}