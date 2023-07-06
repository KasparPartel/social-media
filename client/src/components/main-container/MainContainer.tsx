import { Header } from "../header/Header"
import { Outlet } from "react-router-dom"
import { CreateWebsocket } from "../../additional-functions/websocket"
import "./main-container.css"

export default function MainContainer() {
    CreateWebsocket()

    return (
        <div className="main-container">
            <Header />
            <Outlet />
        </div>
    )
}
