import "./header.css"
import { Logout } from "../../additional-functions/logout"
import { useNavigate } from "react-router-dom"
export default function Navigation() {
    const navigate = useNavigate()

    return (
        <header className="header">
            <nav className="navigation-left">
                <input type="button" className="button navigation__button" value="Profile" />
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
