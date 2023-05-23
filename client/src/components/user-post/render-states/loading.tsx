import "./render-states.css"
import { useEffect, useState } from "react"

export default function Loading({ color }: { color?: string }) {
    const [colorHEX, setColorHEX] = useState("#008290")

    useEffect(() => {
        if (color === "red") {
            setColorHEX("#cf0000")
        }
        if (color === "orange") {
            setColorHEX("#ff9458")
        }
    }, [])

    return (
        <div className="loading-state">
            <div className="loadingio-spinner-eclipse-bvgaz5ygb9e">
                <div className="ldio-vgcwde2jx2k">
                    <div style={{ boxShadow: `0 2px 0 0 ${colorHEX}` }}></div>
                </div>
            </div>
            <p>Loading</p>
        </div>
    )
}
