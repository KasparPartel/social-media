import "./header.css"
import { Logout } from "../../additional-functions/logout"
import { Outlet, useNavigate} from "react-router-dom"
import { useState } from "react";

export default function Navigation() {
    const navigate = useNavigate();
    const id = localStorage.getItem("id")
    const [button, setButton] = useState<boolean[]>([false, false, false, false])


    return (
        <>
        <header className="header">
            <nav className="navigation-left">
              {Button(
                {
                    name: "profile",
                    disabled: button[0],
                    navigate,
                    setButton,
                    buttonId: 0,
                    path: `/user/${id}`
                })}
              {Button(
                {
                    name: "groups",
                    disabled: button[1],
                    navigate,
                    setButton,
                    buttonId: 1,
                    path: `/`
                    
                })}
                {Button(
                {
                    name: "users",
                    disabled: button[2],
                    navigate,
                    setButton,
                    buttonId: 2,
                    path: `/`

                })}
                {Button(
                {
                    name: "notifications",
                    disabled: button[3],
                    navigate,
                    setButton,
                    buttonId: 3,
                    path: `/`
                })}

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
        <Outlet/>
        </>
    )
}

interface buttonProps {
    name: string, 
    disabled: boolean, 
    navigate: (str: string) => void, 
    setButton: (arr: boolean[]) => void, 
    buttonId: number,
    path: string,
}

function Button({name, disabled, navigate, setButton, buttonId, path} : buttonProps) {
    const buttonClass = disabled ? "button_disabled" : "button_active"


    return(
    <input
        type="button"
        className={"button navigation__button " + buttonClass}
        value={name}
        onClick={() => {
            if (disabled) return
            const newBtns = [false, false, false, false]
            newBtns[buttonId] = true
            setButton(newBtns)
            navigate(path);
            }
        }
        />
    )
}