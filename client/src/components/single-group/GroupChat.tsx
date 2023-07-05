import toggleHook from "../../hooks/useToggle"
import { socket } from "../main-container/MainContainer"
import "./group-chat.css"

export function GroupChat() {
    const { toggle: isChatOpen, toggleChange: toggleChat } = toggleHook(false)

    return (
        <>
            <button onClick={toggleChat} className="button group__button">
                Group chat
            </button>
            {isChatOpen ? (
                <div className="chat__wrapper">
                    <div className="chat">
                        <div className="test">chat top with X</div>
                        <div className="test">chat text window</div>
                        <div className="test">chat input
                            <button onClick={() => socket.send("Group chat message")}>Send</button></div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
