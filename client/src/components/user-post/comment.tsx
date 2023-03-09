import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import sendIcon from "../../assets/send-outline.svg"
import { fetchHandlerNoBody } from "../additional-functions/fetchHandler"
import { IdContext } from "../models"
import Loading from "./render-states/loading"
import "./userPost.css"

interface PostComment {
    dateOfCreation: number
    login: string
    parentId: number
    text: string
    userId: number
}

const getComments = async (postId: number) => {
    const response = await fetchHandlerNoBody(
        `http://localhost:8080/post/${postId}/comments`,
        "GET",
    )
    const data = await response.json()
    return data
}

export default function Comments({ postId }: { postId: number }) {
    const [commentsIdList, setCommentsIdList] = useState<number[]>([])
    const userId = useContext(IdContext)
    const [comment, setComment] = useState<PostComment>({
        dateOfCreation: 0,
        login: "test",
        parentId: 0,
        text: "",
        userId: userId.id,
    })

    useEffect(() => {
        getComments(postId).then((data) => setCommentsIdList(data))
    }, [])

    useEffect(() => {
        console.log(comment)
    }, [comment])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setComment((prevState) => {
            const clone = { ...prevState }
            clone.text = (
                e.currentTarget.elements.namedItem("addComment") as HTMLInputElement
            ).value
            clone.dateOfCreation = Date.now()
            return clone
        })

        if (comment.text === "") {
            console.log("Text cannot be empty")
            return
        }

        console.log("submitted")

        // const postComment = () => {
        //     fetch(`http://localhost:8080/post/${postId}/comments`, {
        //         method: "POST",
        //         credentials: "include",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(comment),
        //     })
        // }
        // setComment()
    }

    return (
        <section className="post__comments">
            {commentsIdList.map((id, i) => (
                <Comment id={id} key={i} />
            ))}
            {/* {userId.id !== 1 && ( */}
            <form className="comment__form" onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    name="addComment"
                    className="comment__input"
                    placeholder="Add a comment"
                />
                <button type="submit" className="comment__btn">
                    <img src={sendIcon} alt="send" className="comment__img" />
                </button>
            </form>
            {/* )} */}
        </section>
    )
}

function Comment({ id }: { id: number }) {
    const [comment, setComment] = useState<PostComment>(null)
    const [err, setErr] = useState<Error>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getComment = async () => {
            fetchHandlerNoBody(`http://localhost:8080/comment/${id}`, "GET")
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

        getComment()
    }, [])

    const convertTimeToString = () => {
        const date = new Date(comment.dateOfCreation * 1000)
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }

    if (err) return <div>{err.message}</div>
    if (isLoading) return <Loading />
    return (
        <div className="post__comment">
            <div className="comment__user">
                <Link to={`#`} className="comment__user__link">
                    {comment.login}
                </Link>
                <span className="comment__timestamp">{convertTimeToString()}</span>
            </div>
            <p className="comment__text">{comment.text}</p>
        </div>
    )
}
