import { useEffect, useState } from "react"

/**
 * checks if saved user id (in localStorage) is equal to paramId
 */
export default function checkParamId(paramId: string): boolean {
    const [id, setId] = useState<string>()
    useEffect(() => {
        const storedId = localStorage.getItem("id")
        if (storedId) {
            setId(storedId)
        }
    }, [id])
    return id === paramId
}
