import { Header } from "../header/Header"
import { Outlet } from "react-router-dom"
import { WebSocketService, wsDataSourceProps } from "../../additional-functions/websocket"
import "./main-container.css"
import { createContext, useState } from "react"

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
    const [webSocketInstance, setWebSocketInstance] = useState(
        new WebSocketService([wsDataSource, setWsDataSource]),
    )
    if (!webSocketInstance.isConnected) {
        webSocketInstance.connect("ws://localhost:8080/ws")
    }

    return (
        <websocketContext.Provider value={{ wsDataSource, ws: webSocketInstance }}>
            <div className="main-container">
                <Header />
                <Outlet />
            </div>
        </websocketContext.Provider>
    )
}
