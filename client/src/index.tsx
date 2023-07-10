import "./normalize.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import ReactDOM from "react-dom/client"
import { ErrorDisplay } from "./components/error-display/ErrorDisplay"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <BrowserRouter>
        <ErrorDisplay>
            <App />
        </ErrorDisplay>
    </BrowserRouter>,
)
