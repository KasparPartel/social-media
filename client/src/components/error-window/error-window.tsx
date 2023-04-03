import "./error-window.css"
import { ErrorResponse } from "../models"

interface ErrorWindowProp {
    errorArr: ErrorResponse[]
}

export default function ErrorWindow({ errorArr }: ErrorWindowProp) {
    return (
        <div className="error-window">
            {errorArr.length > 0 && (
                <ul className="error-window__list">
                    {errorArr.map((v, i) => (
                        <li className="error-window__list-item" key={i}>
                            {v.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
