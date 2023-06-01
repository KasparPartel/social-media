import { Dispatch, SetStateAction } from "react"
import fetchHandler from "../../additional-functions/fetchHandler"
import { PostComment, ServerResponse } from "../models"

/**
 *   Fetches all comment ids related to post
 */
export const getCommentsIds = async (postId: number): Promise<ServerResponse<number[]>> => {
    const url = `http://localhost:8080/post/${postId}/comments`

    const res = await fetchHandler(url, "GET")
    if (!res.ok) throw new Error(`HTTP error: status ${res.status}`)

    return await res.json()
}

/**
 * Fetches single comment data
 */
export const getCommentData = (
    commentId: number,
    setComment: Dispatch<SetStateAction<PostComment>>,
    setErr: Dispatch<SetStateAction<Error>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
    fetchHandler(`http://localhost:8080/comment/${commentId}`, "GET")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: status ${res.status}`)
            }
            return res.json()
        })
        .then(
            (data) => {
                setComment(data.data)
                setIsLoading(false)
            },
            (err) => {
                setErr(err)
                setIsLoading(false)
            },
        )
}

/**
 * POSTS comment
 */
export const postComment = (postId: number, comment: PostComment) => {
    fetch(`http://localhost:8080/post/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Error posting to api: ${res.status} status code`)
            }

            getCommentsIds(postId)
        })
        .catch((err) => console.log(err.message))
}
