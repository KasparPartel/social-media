import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchHandlerNoBody } from "../additional-functions/fetchHandler"
import { useOpenText } from "../hooks/openText"
import { IdContext, ServerResponse, User } from "../models"
// import { User } from "../models";
import "./user-information.css"

export function UserInfo() {
    const [user, setUser] = useState<User>({
        avatar: "",
        email: "",
        login: "",
        firstName: "",
        lastName: "",
        aboutMe: "",
        dateOfBirth: 0,
        isPublic: false,
    })

    const { paramId } = useParams()
    const { id } = useContext(IdContext)

    useEffect(() => {
        fetchHandlerNoBody(`http://localhost:8080/user/${paramId}`, `GET`)
            .then((r) => r.json())
            .then((r: ServerResponse) => {
                if (r.errors) return
                setUser(r.data)
            })
    }, [paramId])

    const { height, style, refText, openText } = useOpenText(0)

    return (
        <div className="test-container">
            <div className="information">
                <div className="horizontal-container">
                    <div className="short-info">
                        <div className="short-info__avatar" />
                        <div className="short-info__name">
                            {`${user.firstName} ${user.lastName}`}
                        </div>
                        <button
                            className="button"
                            onClick={() => {
                                openText()
                            }}
                        >
                            {height > 0 ? "Less information ↑" : "More information ↓"}
                        </button>
                    </div>
                    {id === Number(paramId) ? (
                        <button className="button">Create post</button>
                    ) : (
                        <button className="button">Follow</button>
                    )}
                </div>
                <div style={style} className="contaner">
                    <div ref={refText} className="detailed-info">
                        <p className="detailed-info__section">{user.email}</p>
                        <p className="detailed-info__section">{user.login}</p>
                        <p className="detailed-info__section">{user.aboutMe}</p>
                        <p className="detailed-info__section">{user.dateOfBirth}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
