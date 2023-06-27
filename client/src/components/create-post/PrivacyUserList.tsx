import { User } from "../models"
import altAvatar from "../../assets/default-avatar.png"

export default function privateUserList(
    userList: User[],
    selectedArr: number[],
    setSelectedArr: (arg: number[]) => void,
) {
    return userList.map((user, i) => {
        return (
            <label className="add-users__user-checkbox-wrapper" key={i}>
                <input
                    type="checkbox"
                    className="add-users__user-checkbox"
                    onClick={(e) => {
                        const tempArr = selectedArr.slice()
                        if (e.currentTarget.checked && !tempArr.includes(i)) {
                            tempArr.push(i)
                        }
                        if (!e.currentTarget.checked) {
                            const index = tempArr.indexOf(i)
                            if (index >= 0) {
                                tempArr.splice(index, 1)
                            }
                        }
                        setSelectedArr(tempArr)
                    }}
                />
                <div
                    className={"user-card" + (selectedArr.includes(i) ? " user-card_pressed" : "")}
                    key={i}
                >
                    <img
                        className="user-card__avatar"
                        src={user.avatar !== "" ? user.avatar : altAvatar}
                        alt="avatar"
                    />
                    {`${user.firstName} ${user.lastName}`}
                </div>
            </label>
        )
    })
}
