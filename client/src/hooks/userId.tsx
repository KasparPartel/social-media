import { useEffect, useState } from "react"

/**
 * checks if saved user id (in localStorage) is equal to paramId
 */
export default function useUserId(paramId: string): boolean {
    const [id, setId] = useState<string>()
    useEffect(() => {
        const id = localStorage.getItem("id")
        if (id) {
            setId(id)
        }
    }, [id])
    return id === paramId
}
