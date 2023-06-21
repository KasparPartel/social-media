import "./header.css"
import { Logout } from "../../additional-functions/logout"
import { Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"

interface entryButton {
    id?: number
}

export default function Header({ id }: entryButton) {
    const navigate = useNavigate()
    const deafultState = [false, false, false, false]
    deafultState[id] = true
    const [buttonState, setButtonState] = useState<boolean[]>(deafultState)

    const customButtonInfo = [
        { name: "Profile", path: `/user/${localStorage.getItem("id")}` },
        { name: "Groups", path: `/groups` },
        { name: "Users", path: `/` },
        { name: "Notifications", path: `/` },
    ]

    return (
        <>
            <header className="header">
                {customButtonInfo.map(({ name, path }, i) => {
                    return (
                        <Button
                            key={i}
                            {...{
                                name,
                                path,
                                isDisabled: buttonState[i],
                                buttonId: i,
                                navigate,
                                setButtonState,
                            }}
                        />
                    )
                })}
                <input
                    type="button"
                    className="button header__button header__button_red header__button_right-side"
                    value="Logout"
                    onClick={() => {
                        Logout(navigate)
                    }}
                />
            </header>
            <Outlet />
        </>
    )
}

interface buttonProps {
    name: string
    path: string
    isDisabled: boolean
    buttonId: number
    navigate: (str: string) => void
    setButtonState: (arr: boolean[]) => void
}

function Button({ name, path, isDisabled, buttonId, navigate, setButtonState }: buttonProps) {
    const buttonClass = isDisabled ? "button_disabled" : ""

    return (
        <input
            type="button"
            className={"button header__button " + buttonClass}
            value={name}
            onClick={() => {
                if (!isDisabled) {
                    const newBtns = [false, false, false, false]
                    newBtns[buttonId] = true
                    setButtonState(newBtns)
                    navigate(path)
                }
            }}
        />
    )
}
