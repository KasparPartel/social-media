import { Yeti } from "./yeti"
import { Light } from "./light"
import "./error-not-found.css"
import { useEffect } from "react"
import { YetiAnimation } from "./yetiAnimation"

export function ErrorNotFound() {
    useEffect(() => {
        YetiAnimation()
    })
    return (
        <div className="error-not-found__wrapper">
            <Yeti />
            <Light />
        </div>
    )
}
