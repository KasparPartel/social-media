import { NavigateFunction, useNavigate } from "react-router-dom";
import LoadingSkeleton from "../render-states/LoadingSkeleton";
import { useEffect, useState } from "react";
import { User } from "../models";
import { UserList } from "./UserList";
import "./userListPage.css"
import fetchHandler from "../../additional-functions/fetchHandler";
import { fetchErrorChecker } from "../../additional-functions/fetchErr";
import { ErrorsDisplayType, useErrorsContext } from "../error-display/ErrorDisplay";

export function UserListPage() {
  const navigate = useNavigate();
  const { displayErrors } = useErrorsContext();

  const [isLoading, setLoading] = useState(true);
  const [userIdList, setUserIdList] = useState<number[]>();
  const [userList, setUserList] = useState<User[]>();

  // Getting all users' IDs
  useEffect(() => {
    getUsersList({ idException: Number(localStorage.getItem("id")), setUserList, navigate, displayErrors })
  }, [isLoading])

  if (isLoading) return <LoadingSkeleton dataName="list of users" />

  if (!(userIdList && userIdList.length > 0) || !(userList && userList.length > 0)) navigate("/error-not-found");

  return (
    <ul className="user-list__wrapper">
      <UserList userList={userList} />
    </ul>
  )
}

type GetUsersProps = {
  idException: number
  setUserList: React.Dispatch<React.SetStateAction<User[]>>
  navigate: NavigateFunction
  displayErrors: ErrorsDisplayType
}

function getUsersList({ idException, setUserList, navigate, displayErrors }: GetUsersProps) {
  fetchHandler(`http://localhost:8080/users`, "GET")
    .then((r) => {
      if (!r.ok) {
        throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
      }
      return r.json()
    })
    .then((r) => {
      if (r.errors) throw r.errors

      const promiseArr: Promise<User | null>[] = []
      r.data.forEach((userId: number) => {
        if (userId === idException) return;
        const user: Promise<User | null> = fetchHandler(
          `http://localhost:8080/user/${userId}`,
          "GET",
        )
          .then((r) => {
            if (!r.ok) throw [{ code: r.status, description: `HTTP error: ${r.statusText}` }]
            return r.json()
          })
          .then((r) => {
            if (r.errors) throw r.errors
            return r.data
          })
          .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
            return null
          })
        promiseArr.push(user)
      })

      Promise.all(promiseArr).then((userArr) => {
        userArr.filter((user) => user !== null)
        setUserList(userArr)
      })
    })
    .catch((errArr) => {
      fetchErrorChecker(errArr, navigate, displayErrors)
    })
}