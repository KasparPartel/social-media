import { useEffect } from "react";
import { User } from "../components/models";
import { fetchHandlerNoBody } from "./fetchHandler";

interface followingProps {
    id: number,
    setFollowingList: (users: User[]) => void,
}
export function getFollowing({id, setFollowingList}: followingProps) {
    useEffect(() => {
    fetchHandlerNoBody(`http://localhost:8080/user/${id}/followings`, "GET")
        .then((r) => r.json())
        .then((r) => {
            const userList = []
            r.data.forEach(
                (followedId: string) => {
                    fetchHandlerNoBody(`http://localhost:8080/user/${followedId}`, "GET")
                    .then((r) => r.json())
                    .then((r) => {
                        userList.push(r.data)
                        setFollowingList(userList)
                    })
                }
            )
        })
        .catch(() => {
            throw ("Error")
        })
    }, [id])
}