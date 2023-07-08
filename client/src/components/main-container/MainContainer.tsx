import { Header } from "../header/Header"
import { Outlet } from "react-router-dom"
import { WebSocketService, wsDataSourceProps } from "../../additional-functions/websocket"
import "./main-container.css"
import { createContext, useRef, useState } from "react"

interface websocketContextProps {
    wsDataSource: wsDataSourceProps
    ws: WebSocketService
}

const deafultWsDataSource = {
    chat: [],
    eventNotification: [],
}

export const websocketContext = createContext<websocketContextProps>({
    wsDataSource: deafultWsDataSource,
    ws: null,
})

export default function MainContainer() {
    const [wsDataSource, setWsDataSource] = useState<wsDataSourceProps>(deafultWsDataSource)
    const webSocketInstance = useRef(new WebSocketService(setWsDataSource))

    if (!webSocketInstance.current.isConnected) {
        webSocketInstance.current.connect("ws://localhost:8080/ws")
    }

    return (
        <websocketContext.Provider value={{ wsDataSource, ws: webSocketInstance.current }}>
            <div className="main-container">
                <Header />
                <Outlet />
            </div>
        </websocketContext.Provider>
    )
}
