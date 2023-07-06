import { useState } from "react"
import { BasePayload, ServerMessage, ws } from "../../additional-functions/websocket"
import toggleHook from "../../hooks/useToggle"
import sendIcon from "../../assets/send-outline.svg"
import "./group-chat.css"

interface GroupChatProp {
    groupId: number
}

export function GroupChat({ groupId }: GroupChatProp) {
    const { toggle: isChatOpen, toggleChange: toggleChat } = toggleHook(false)
    const groupChat: BasePayload = { event: "join", payload: { groupId } }
    const [chatData, setChatData] = useState<ServerMessage[]>(null)
    const [inputText, setInputText] = useState("")

    return (
        <>
            <button
                onClick={() => {
                    ws.send(JSON.stringify(groupChat))
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
                            {chatData
                                ? chatData.map((message: ServerMessage) => {
                                    return message.text
                                })
                                : null}
                        </div>
                        <div className="test">
                            <form
                                className="comment__form"
                                onSubmit={(e) => handleSubmit(e, inputText)}
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

function handleSubmit(e: React.FormEvent<HTMLFormElement>, inputText: string) {
    e.preventDefault()

    const text = inputText.trim()
    if (text === "") {
        return
    }

    const message: BasePayload = {
        event: "message",
        payload: { text: inputText },
    }
    ws.send(JSON.stringify(message))
}