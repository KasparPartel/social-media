import { useContext, useState } from "react"
import { WebSocketService } from "../../additional-functions/websocket"
import toggleHook from "../../hooks/useToggle"
import sendIcon from "../../assets/send-outline.svg"
import "./group-chat.css"
import { BasePayload, Message, ServerMessage } from "../models"
import { websocketContext } from "../main-container/MainContainer"

interface GroupChatProp {
    groupId: number
}

export function GroupChat({ groupId }: GroupChatProp) {
    const groupChatJoin: BasePayload = {
        eventType: "join",
        payload: { id: groupId, isGroup: true },
    }
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
                        <div className="test">chat top with X</div>
                        <div className="test">
                            {wsDataSource ? (
                                wsDataSource.chat.map((message: ServerMessage, i) => {
                                    return <li key={i}>{message.text}</li>
                                })
                            ) : (
                                <p>Something went wrong while trying to receive messages</p>
                            )}
                        </div>
                        <div className="test">
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
                    </div>
                </div>
            ) : null}
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
