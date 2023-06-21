import fetchHandler from "../../additional-functions/fetchHandler"

export const sendJoinRequest = (
  groupId: number,
  setJoinStatus: React.Dispatch<React.SetStateAction<number>>,
) => {
  fetchHandler(`http://localhost:8080/group/:${groupId}/join`, "PUT").then((resp) => {
    if (!resp.ok) {
      throw new Error(`HTTP error: status ${resp.status}`)
    }
    return resp.json()
  }).then((resp) => { console.log(JSON.stringify(resp)) })
}

// import fetchHandler from "../../additional-functions/fetchHandler"
// import { Dispatch, SetStateAction } from "react"
// import { Post, PostComment } from "../models"

// /**
//  *  Fetches all post ids related to user
//  */
// export const getPostIds = (
//     userId: number,
//     setIdList: Dispatch<SetStateAction<number[]>>,
//     setErr: Dispatch<SetStateAction<Error>>,
// ) => {
//     fetchHandler(`http://localhost:8080/user/${userId}/posts`, "GET")
//         .then((res) => {
//             if (!res.ok) {
//                 throw new Error(`HTTP error: status ${res.status}`)
//             }
//             return res.json()
//         })
//         .then(
//             (data) => setIdList(data.data),
//             (err) => setErr(err),
//         )
// }

// /**
//  *  Fetches single post data
//  */
// export const getPostData = (
//     postId: number,
//     setPost: Dispatch<SetStateAction<Post>>,
//     setErr: Dispatch<SetStateAction<Error>>,
//     setIsLoading: Dispatch<SetStateAction<boolean>>,
// ) => {
//     fetchHandler(`http://localhost:8080/post/${postId}`, "GET")
//         .then((res) => {
//             if (!res.ok) {
//                 throw new Error(`HTTP error: status ${res.status}`)
//             }
//             return res.json()
//         })
//         .then((data) => {
//             fetchHandler(`http://localhost:8080/user/1`, `GET`)
//                 .then((r) => r.json())
//                 .then((r) => {
//                     if (r.errors) throw new Error(`HTTP error: status ${r.status}`)
//                     data.data.login = r.data.login
//                     data.data.firstName = r.data.firstName
//                     data.data.lastName = r.data.lastName
//                     setPost(data.data)
//                     setIsLoading(false)
//                 })
//         })
//         .catch((err) => {
//             setErr(err)
//             setIsLoading(false)
//         })
// }
