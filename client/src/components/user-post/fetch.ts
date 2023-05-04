import fetchHandler from "../../additional-functions/fetchHandler"
import { Dispatch, SetStateAction } from "react"
import { Post, PostComment } from "../models"

/*
 *  Fetches all post ids related to user
 */
export const getPostIds = (
    userId: number,
    setIdList: Dispatch<SetStateAction<number[]>>,
    setErr: Dispatch<SetStateAction<Error>>,
) => {
    fetchHandler(`http://localhost:8080/user/${userId}/posts`, "GET")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: status ${res.status}`)
            }
            return res.json()
        })
        .then(
            (data) => setIdList(data.data),
            (err) => setErr(err),
        )
}

/*
 *  Fetches single post data
 */
export const getPostData = (
    postId: number,
    setPost: Dispatch<SetStateAction<Post>>,
    setErr: Dispatch<SetStateAction<Error>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
    fetchHandler(`http://localhost:8080/post/${postId}`, "GET")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: status ${res.status}`)
            }
            return res.json()
        })
        .then(
            (data) => {
                setPost(data.data)
                setIsLoading(false)
            },
            (err) => {
                setErr(err)
                setIsLoading(false)
            },
        )
}

/*
 *   Fetches all comment ids related to post
 */
export const getCommentsIds = (
    postId: number,
    setCommentsIdList: Dispatch<SetStateAction<number[]>>,
    setErr: Dispatch<SetStateAction<Error>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
    fetchHandler(`http://localhost:8080/post/${postId}/comments`, "GET")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: status ${res.status}`)
            }
            return res.json()
        })
        .then(
            (data) => {
                setCommentsIdList(data)
                setIsLoading(false)
            },
            (err) => {
                setErr(err)
                setIsLoading(false)
            },
        )
}

/*
 * Fetches single post data
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
                setComment(data)
                setIsLoading(false)
            },
            (err) => {
                setErr(err)
                setIsLoading(false)
            },
        )
}

/*
 * POSTS comment
 */
export const postComment = (
    postId: number,
    comment: PostComment,
    setCommentsIdList: Dispatch<SetStateAction<number[]>>,
    setErr: Dispatch<SetStateAction<Error>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
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

            getCommentsIds(postId, setCommentsIdList, setErr, setIsLoading)
        })
        .catch((err) => console.log(err.message))
}
