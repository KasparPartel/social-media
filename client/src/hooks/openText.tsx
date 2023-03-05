import { useEffect, useRef, useState } from "react"

/**
 * used to return needed parts for animated opening/closing an html element (via transition)
 * @returns text height in px, a block of height style, ref to be used with the element and a function to trigger height change
 */
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
