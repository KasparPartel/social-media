import "./header.css"
import { Logout } from "../additional-functions/logout"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { IdContext } from "../models"
import { GetUserInfo } from "../additional-functions/profile"
export default function Navigation() {
    const navigate = useNavigate()
    const { id } = useContext(IdContext)

    return (
        <header className="header">
            <nav className="navigation-left">
                <input 
                    type="button"
                    className="button navigation__button" 
                    value="Profile"
                    onClick={() => {
                        GetUserInfo(id, navigate)
                    }}
                />
                <input type="button" className="button navigation__button" value="Groups" />
                <input type="button" className="button navigation__button" value="Users" />
                <input type="button" className="button navigation__button" value="Notifications" />
            </nav>
            <input
                type="button"
                className="button navigation__button navigation__button_red"
                value="Logout"
                onClick={() => {
                    Logout(navigate)
                }}
            />
        </header>
    )
}
