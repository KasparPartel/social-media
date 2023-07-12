import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../render-states/LoadingSkeleton";
import { useState } from "react";
import { User } from "../models";
import { UserList } from "./UserList";

export function UserListPage() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [userIdList, setUserIdList] = useState<number[]>();
  const [userList, setUserList] = useState<User[]>();

  if (isLoading) return <LoadingSkeleton dataName="list of users" />

  if (!(userIdList && userIdList.length > 0) || !(userList && userList.length > 0)) navigate("/error-not-found");

  return (
    <>
      <ul className="user-list__wrapper">
        <UserList userList={userList} />
      </ul>
    </>
  )
}