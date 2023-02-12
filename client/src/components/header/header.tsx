import "./header.css"
import { Logout } from "../additional-functions/ahf"
export default function Navigation() {
    return (
        <header className="header">
            <nav className="navigation-left">
                <input type="button" className="navigation__button" value="Profile" />
                <input type="button" className="navigation__button" value="Groups" />
                <input type="button" className="navigation__button" value="Users" />
                <input type="button" className="navigation__button" value="Notifications" />
            </nav>
            <input
                type="button"
                className="navigation__button navigation__button_red"
                value="Logout"
                onClick={Logout}
            />
        </header>
    )
}
