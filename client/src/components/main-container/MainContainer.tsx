import { Header } from "../header/Header"
import { Outlet } from "react-router-dom"
import "./main-container.css"

export default function MainContainer() {
    return (
        <div className="main-container">
            <Header buttonIndex={0} />
            <Outlet />
        </div>
    )
}
