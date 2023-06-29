import { Astronaut } from "./astronaut"
import { Planet } from "./planet"
import { Shuttle } from "./shuttle"
import "./error-general.css"

export function ErrorGeneral() {
    return (
        <div className="container">
            <div className="main">
                <Planet />
                <Shuttle />
                <Astronaut />
            </div>
            <p className="MainTitle">Houston, we have a problem.</p>
        </div>
    )
}
