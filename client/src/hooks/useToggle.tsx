import { useState } from "react"

export default function toggleHook(initialState: boolean) {
    const [toggle, setToggle] = useState(initialState)
    const toggleChange = () => {
        setToggle(!toggle)
    }
    return { toggle, toggleChange }
}
