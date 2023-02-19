import { useEffect, useRef, useState } from "react"

export const useOpenText = (minHeight: number) => {
    const refText = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState<number>(minHeight)
    const style = { maxHeight: `${height}px` }
    const [isTextOpen, setTextOpen] = useState<boolean>(false)
    const openText = () => {
        setTextOpen(!isTextOpen)
    }
    useEffect(() => {
        isTextOpen ? setHeight(refText.current.scrollHeight) : setHeight(minHeight)
    }, [isTextOpen])

    return { height, style, refText, openText }
}
