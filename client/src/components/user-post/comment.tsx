import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchHandlerNoBody } from "../../additional-functions/fetchHandler"
import sendIcon from "../../assets/send-outline.svg"
import useUserInfo from "../../hooks/userInfo"
import Loading from "./render-states/loading"
import "./userPost.css"

interface PostComment {
    dateOfCreation: number
    login: string
    parentId: number
    text: string
    userId: string
}

const getComments = async (postId: number) => {
    const response = await fetchHandlerNoBody(
        `http://localhost:8080/post/${postId}/comments`,
        "GET",
    )
    return await response.json()
}

export default function CommentList({ postId }: { postId: number }) {
    const [commentsIdList, setCommentsIdList] = useState<number[]>([])
    // const { paramId } = useParams()
    // const user = useUserInfo(paramId)
    const myUser = useUserInfo(localStorage.getItem("id"))
    const [inputText, setInputText] = useState("")

    useEffect(() => {
        getComments(postId).then((data) => setCommentsIdList(data))
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (inputText === "") {
            return
        }

        const comment: PostComment = {
            dateOfCreation: Date.now(),
            login: myUser.login ?? "",
            parentId: 0,
            text: inputText,
            userId: myUser.id,
        }

        console.log(comment)

        const postComment = () => {
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
                    console.log("submitted")

                    getComments(postId).then((data) => setCommentsIdList(data))
                })
                .catch((err) => console.log(err.message))
        }

        postComment()
    }

    return (
        <section className="post__comments">
            {commentsIdList.map((id, i) => (
                <Comment id={id} key={i} />
            ))}
            {myUser && (
                <form className="comment__form" onSubmit={(e) => handleSubmit(e)}>
                    <input
                        type="text"
                        name="addComment"
                        className="comment__input"
                        placeholder="Add a comment"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button type="submit" className="comment__btn">
                        <img src={sendIcon} alt="send" className="comment__img" />
                    </button>
                </form>
            )}
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
                <Link to={`/user/${comment.userId}`} className="comment__user__link">
                    {comment.login}
                </Link>
                <span className="comment__timestamp">{convertTimeToString()}</span>
            </div>
            <p className="comment__text">{comment.text}</p>
        </div>
    )
}
