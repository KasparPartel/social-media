import fetchHandler from "../../additional-functions/fetchHandler"
import { Dispatch, SetStateAction } from "react"
import { Post } from "../models"
import { NavigateFunction } from "react-router-dom"
import { ErrorsDisplayType } from "../error-display/ErrorDisplay"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"

/**
 *  Fetches all post ids related to user
 */
export const getPostIds = (
    userId: number,
    setIdList: Dispatch<SetStateAction<number[]>>,
    setErr: Dispatch<SetStateAction<Error>>,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
) => {
    fetchHandler(`http://localhost:8080/user/${userId}/posts`, "GET")
        .then((res) => {
            if (!res.ok) {
                throw [{ code: res.status, description: `HTTP error: status ${res.statusText}` }]
            }
            return res.json()
        })
        .then((r) => {
            if (r.errors) {
                throw r.errors
            }
            setIdList(r.data)
        })
        .catch((errArr) => {
            setErr(errArr)
            fetchErrorChecker(errArr, navigate, displayErrors)
        })
}

/**
 *  Fetches single post data
 */
export const getPostData = (
    postId: number,
    setPost: Dispatch<SetStateAction<Post>>,
    setErr: Dispatch<SetStateAction<Error>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction,
    displayErrors: ErrorsDisplayType,
) => {
    fetchHandler(`http://localhost:8080/post/${postId}`, "GET")
        .then((res) => {
            if (!res.ok) {
                throw [{ code: res.status, description: `HTTP error: status ${res.statusText}` }]
            }
            return res.json()
        })
        .then((data) => {
            fetchHandler(`http://localhost:8080/user/1`, `GET`)
                .then((r) => {
                    if (!r.ok) {
                        throw [
                            { code: r.status, description: `HTTP error: status ${r.statusText}` },
                        ]
                    }
                    return r.json()
                })
                .then((r) => {
                    if (r.errors) throw r.errors
                    data.data.login = r.data.login
                    data.data.firstName = r.data.firstName
                    data.data.lastName = r.data.lastName
                    setPost(data.data)
                    setIsLoading(false)
                })
                .catch((errArr) => {
                    fetchErrorChecker(errArr, navigate, displayErrors)
                })
        })
        .catch((errArr) => {
            fetchErrorChecker(errArr, navigate, displayErrors)
            setErr(errArr)
            setIsLoading(false)
        })
}
