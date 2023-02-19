import { useContext } from "react"
import { useParams } from "react-router-dom"
import { useOpenText } from "../../hooks/openText"
import useUserInfo from "../../hooks/userInfo"
import { IdContext } from "../models"
// import { User } from "../models";
import "./user-information.css"

export function UserInfo() {
    const { paramId } = useParams()
    const { id } = useContext(IdContext)

    const { height, style, refText, openText } = useOpenText(0)
    const { user } = useUserInfo(paramId)

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
                        {user.email ? (
                            <label className="label">
                                Email:<p className="detailed-info__section">{user.email}</p>
                            </label>
                        ) : null}
                        {user.login ? (
                            <label className="label">
                                Username:<p className="detailed-info__section">{user.login}</p>
                            </label>
                        ) : null}
                        {user.aboutMe ? (
                            <label className="label">
                                About me:<p className="detailed-info__section">{user.aboutMe}</p>
                            </label>
                        ) : null}
                        {user.dateOfBirth ? (
                            <label className="label">
                                Birth date:
                                <p className="detailed-info__section">
                                    {new Date(user.dateOfBirth).toLocaleDateString("en-US")}
                                </p>
                            </label>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
