import { useNavigate } from "react-router-dom"
import { Logout } from "../../additional-functions/logout"
import { useEffect, useState } from "react"
import "./header.css"
import useParamId from "../../hooks/useParamId"

interface entryButton {
    buttonIndex?: number
}

interface buttonProps {
    name: string
    path: string
    isDisabled: boolean
    buttonId: number
    navigate: (str: string) => void
    setButtonState: (arr: boolean[]) => void
}

const customButtonInfo = [
    { name: "Profile", path: `/user/${localStorage.getItem("id")}` },
    { name: "Groups", path: `/groups` },
    { name: "Users", path: `/users` },
    { name: "Notifications", path: `/notifications` },
]
const defaultState = Array<boolean>(customButtonInfo.length).fill(false)

export function Header({ buttonIndex }: entryButton) {
    const { isMyProfile } = useParamId()
    const navigate = useNavigate()

    const [buttonState, setButtonState] = useState<boolean[]>(defaultState)
    useEffect(() => {
        setButtonState((prevState) => {
            const temp = Object.assign({}, prevState)
            temp[buttonIndex] = isMyProfile || buttonIndex != 0
            return temp
        })
    }, [isMyProfile])

    return (
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
                className="button button_red header__button header__button_right-side"
                value="Logout"
                onClick={() => {
                    Logout(navigate)
                }}
            />
        </header>
    )
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
