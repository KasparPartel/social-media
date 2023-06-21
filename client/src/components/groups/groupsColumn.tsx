import { useEffect, useState } from "react"
import LoadingSkeleton from "../render-states/LoadingSkeleton"
import { JoinGroupButton } from "./joinGroupButton"
import { fetchGroupsResponse, groupsFetchData } from "./groupsPage"

export function GroupsColumn({ groupList }: { groupList: groupsFetchData[] }): React.JSX.Element {
  // return UserPosts({ idList, err })

  return (
    <div className="groups-list-column">
      {groupList.map((group, key) => {
        return (
          <div className="group-card" key={key}>
            <span className="group-card-title">{group.title}</span>
            <span className="group-card-space"></span>
            <JoinGroupButton initJoinStatus={group.joinStatus} groupId={group.id} />
          </div>
        )
      })}
    </div>
  )
}