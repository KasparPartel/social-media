import { useContext, useState } from "react"
import { WebSocketService } from "../../additional-functions/websocket"
import toggleHook from "../../hooks/useToggle"
import sendIcon from "../../assets/send-outline.svg"
import { BasePayload, Message, ServerMessage } from "../models"
import { websocketContext } from "../main-container/MainContainer"
import useParamId from "../../hooks/useParamId"
import Cross from "../../assets/Cross.svg"
import Emojis from "../../assets/VectorEmojis.svg"
import "./chat.css"
import { convertDateToString } from "../../additional-functions/time"
import { Link } from "react-router-dom"
import Username from "../post-comment/Username"

interface GroupChatProp {
    id: number
    isGroup: boolean
}

export function Chat({ id, isGroup }: GroupChatProp) {
    const groupChatJoin: BasePayload = {
        eventType: "join",
        payload: { id, isGroup },
    }
    const userId = Number(localStorage.getItem("id"))
    const { wsDataSource, ws } = useContext(websocketContext)
    const { toggle: isChatOpen, toggleChange: toggleChat } = toggleHook(false)
    const [inputText, setInputText] = useState("")

    return (
        <>
            <button
                onClick={() => {
                    ws.send(JSON.stringify(groupChatJoin))
                    toggleChat()
                }}
                className="button group__button"
            >
                Group chat
            </button>
            {isChatOpen ? (
                <div className="chat__wrapper">
                    <div className="chat">
                        <div className={"chat__info" + (isGroup ? " chat__info_group" : "")}>
                            <button
                                className="chat__button"
                                onClick={() => {
                                    ws.clearChat()
                                    setInputText("")
                                    toggleChat()
                                }}
                            >
                                <img
                                    src={Cross}
                                    alt="close"
                                    className="comment__img"
                                />
                            </button>
                        </div>
                        <div className="chat__conversation-window">
                            {wsDataSource ? (
                                wsDataSource.chat.reverse().map((message: ServerMessage, i) => {
                                    return (
                                        <div key={i} className={"post__comment" + (userId === message.userId ? " chat__message-right" : " chat__message-left")}>
                                            <div className="comment__info">
                                                <div className="comment__user">
                                                    <Link to={`/user/${message.userId}`} className="comment__user__link">
                                                        <Username userId={message.userId} />
                                                    </Link>
                                                    <span className="comment__timestamp">
                                                        {convertDateToString(message.creationDate)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="comment__text">{message.text}</p>
                                        </div>
                                    )
                                })
                            ) : (
                                <p>Something went wrong while trying to receive messages</p>
                            )}
                        </div>
                        <form
                            className="comment__form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit(inputText, ws)
                            }}
                        >
                            <div className="comment-posting__container">
                                <input
                                    type="text"
                                    name="addComment"
                                    className="comment__input"
                                    placeholder="Type your message..."
                                    autoComplete="off"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <div className="comment-posting__buttons">
                                    <button type="button" className="comment__btn">
                                        <img
                                            src={Emojis}
                                            alt="emojis"
                                            className="comment__img"
                                        />
                                    </button>
                                    <button type="submit" className="comment__btn">
                                        <img
                                            src={sendIcon}
                                            alt="send"
                                            className="comment__img"
                                        />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div >
            ) : null
            }
        </>
    )
}

function handleSubmit(inputText: string, ws: WebSocketService) {
    const text = inputText.trim()
    if (text === "") {
        return
    }

    const message: BasePayload<Message> = {
        eventType: "message",
        payload: { content: inputText },
    }
    ws.send(JSON.stringify(message))
}
