import "./header.css"
import { Logout } from "../../additional-functions/logout"
import { useNavigate} from "react-router-dom"
import { disable } from "../../additional-functions/disableButton"

export default function Navigation() {
    const navigate = useNavigate();
    const id = localStorage.getItem("id")


    return (
        <header className="header">
            <nav className="navigation-left">
                <input 
                    type="button"
                    className="button navigation__button" 
                    value="Profile"
                    onClick={() => {
                        navigate(`/user/${id}`);
                        disable(0);
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
