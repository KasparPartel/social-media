import { useContext, useRef } from "react"
import { WebSocketService } from "../../additional-functions/websocket"
import toggleHook from "../../hooks/useToggle"
import sendIcon from "../../assets/send-outline.svg"
import envelope from "../../assets/envelope.svg"
import { BasePayload, Message, ServerMessage } from "../../models"
import { websocketContext } from "../../pages/main-container/MainContainer"
import EmojiPicker, { EmojiStyle } from "emoji-picker-react"
import Cross from "../../assets/Cross.svg"
import Emojis from "../../assets/VectorEmojis.svg"
import "./chat.css"
import { convertDateToString } from "../../additional-functions/time"
import { Link } from "react-router-dom"
import Username from "../post-comment/Username"
import useToggle from "../../hooks/useToggle"

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
    const inputRef = useRef<HTMLInputElement>()

    const { toggle: isEmojisOpen, toggleChange: toggleEmojis } = useToggle(false)
    const handleEmojiClick = (emojiObject) => {
        inputRef.current.value = inputRef.current.value + emojiObject.emoji
    }

    return (
        <>
            <button
                onClick={() => {
                    ws.clearChat()
                    ws.send(JSON.stringify(groupChatJoin))
                    toggleChat()
                }}
                className="button group__button group__button_small-padding"
            >
                <img src={envelope} alt="chat" className="chat__img chat__img_short" />
            </button>
            {isChatOpen ? (
                <div className="chat__wrapper">
                    {isEmojisOpen ? (
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            lazyLoadEmojis
                            emojiStyle={EmojiStyle.GOOGLE}
                        />
                    ) : null}
                    <div className="chat">
                        <div className="chat__info">
                            <button
                                className="chat__button"
                                onClick={() => {
                                    ws.clearChat()
                                    inputRef.current.value = ""
                                    isEmojisOpen ? toggleEmojis() : null
                                    toggleChat()
                                }}
                            >
                                <img src={Cross} alt="close" className="chat__img" />
                            </button>
                        </div>
                        <div className="chat__conversation-window">
                            {wsDataSource ? (
                                wsDataSource.chat
                                    .slice(0)
                                    .reverse()
                                    .map((message: ServerMessage, i) => {
                                        return (
                                            <div
                                                key={i}
                                                className={
                                                    "chat__message" +
                                                    (userId === message.userId
                                                        ? " chat__message_right"
                                                        : " chat__message_left")
                                                }
                                            >
                                                <div className="comment__info">
                                                    <div className="comment__user">
                                                        <Link
                                                            to={`/user/${message.userId}`}
                                                            className="comment__user__link"
                                                        >
                                                            <Username userId={message.userId} />
                                                        </Link>
                                                        <span className="comment__timestamp">
                                                            {convertDateToString(
                                                                message.creationDate,
                                                            )}
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
                                handleSubmit(inputRef.current.value, ws)
                                inputRef.current.value = ""
                            }}
                        >
                            <div className="comment-posting__container">
                                <input
                                    type="text"
                                    name="addComment"
                                    className="comment__input"
                                    placeholder="Type your message..."
                                    autoComplete="off"
                                    ref={inputRef}
                                />
                                <div className="comment-posting__buttons">
                                    <button
                                        type="button"
                                        onClick={toggleEmojis}
                                        className="comment__btn"
                                    >
                                        <img src={Emojis} alt="emojis" className="comment__img" />
                                    </button>
                                    <button type="submit" className="comment__btn">
                                        <img src={sendIcon} alt="send" className="comment__img" />
                                    </button>
                                </div>
                            </div>
                        </form>
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
