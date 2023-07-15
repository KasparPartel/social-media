import fetchHandler from "../../additional-functions/fetchHandler"
import { PostComment, ServerResponse } from "../../models"

/**
 *   Fetches all comment ids related to post
 */
export const getCommentsIds = async (postId: number): Promise<ServerResponse<number[]>> => {
    const url = `http://localhost:8080/post/${postId}/comments`

    const res = await fetchHandler(url, "GET")
    if (!res.ok) throw [{ code: res.status, description: `HTTP error: ${res.statusText}` }]

    return await res.json()
}

/**
 * Fetches single comment data
 */
export const getCommentData = async (commentId: number): Promise<ServerResponse<PostComment>> => {
    const url = `http://localhost:8080/comment/${commentId}`

    const res = await fetchHandler(url, "GET")
    if (!res.ok) throw [{ code: res.status, description: `HTTP error: ${res.statusText}` }]

    return await res.json()
}

/**
 * POSTS comment
 */
export const postComment = async (
    postId: number,
    comment: PostComment,
): Promise<ServerResponse<PostComment>> => {
    const res = await fetch(`http://localhost:8080/post/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
    })
    if (!res.ok) throw [{ code: res.status, description: `HTTP error: ${res.statusText}` }]

    return await res.json()
}
