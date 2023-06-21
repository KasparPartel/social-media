import { useEffect, useState } from "react";
import LoadingSkeleton from "../render-states/LoadingSkeleton";
import { GroupsColumn } from "./groupsColumn";
import fetchHandler from "../../additional-functions/fetchHandler";
import "./groups.css"
import { JoinGroupButton } from "./joinGroupButton";

export type groupsFetchData = {
  id: number     // group id
  title: string  // group title
  joinStatus: number // 1 - not joined, 2 - requested, 3 - joined
}

export type fetchErrorsData = {
  code: number,
  description: string,
}

export type fetchGroupsResponse = {
  data: groupsFetchData[],
  errors: fetchErrorsData[],
}

const rowAmount = 2

export function GroupsPage() {
  const [err, setErr] = useState<fetchErrorsData[]>(null)

  const [isLoading, setLoading] = useState(true);
  const [groupList, setGroupList] = useState<groupsFetchData[]>([])

  useEffect(() => {
    getAllGroups(setGroupList, setErr, setLoading)
  }, [isLoading])

  if (isLoading) return <LoadingSkeleton dataName="groups" />

  if (groupList.length === 0) {
    return (
      <p>No Groups, yet!</p>
    )
  }

  console.table("Group list: (current)" + groupList)
  return (
    <main id="groups-main">
      <div id="create-group-button-container">
        <button id="create-group-button">Create New Group</button>
      </div>
      <div id="group-list" style={{ gridTemplateColumns: `${' 1fr'.repeat(rowAmount)}` }}>
        {new Array(groupList.length < rowAmount ? groupList.length : rowAmount).fill("").map((x, rowIndex) => {
          console.table(groupList.filter((group, groupId) => groupId % rowAmount === rowIndex))
          return groupList.map((group, key) => {
            return (
              <div className="group-card" key={key}>
                <span className="group-card-title">{group.title}</span>
                <span className="group-card-space"></span>
                <JoinGroupButton initJoinStatus={group.joinStatus} groupId={group.id} />
              </div>
            )
          })
        })}
      </div>
    </main>
  )
}

function getAllGroups(
  setGroupList: React.Dispatch<React.SetStateAction<groupsFetchData[]>>,
  setErr: React.Dispatch<React.SetStateAction<fetchErrorsData[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  fetchHandler(`http://localhost:8080/groups`, "GET")
    .then((r) => r.json())
    .then((response) => {
      if (response.errors) throw new Error(`HTTP error: status ${response.status}`)
      console.table(response.data)
      setGroupList((prev) => response.data)
      setLoading(() => false)
    })
    .catch((err) => {
      setErr(err)
      setLoading(false)
    })
}