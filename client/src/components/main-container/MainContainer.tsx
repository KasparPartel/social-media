import { Header } from "../header/Header"
import { Outlet } from "react-router-dom"
import "./main-container.css"
import { useEffect } from "react"

export let socket: WebSocket

export default function MainContainer() {
    useEffect(() => {
        if (socket && socket.readyState !== 1) {
            socket = new WebSocket(`ws://localhost:8080/ws`)
        }
        console.log(socket)
    })

    return (
        <div className="main-container">
            <Header />
            <Outlet />
        </div>
    )
}




// socket.onopen = (e) => {
//     alert("[open] Соединение установлено")
//     alert("Отправляем данные на сервер")
// }

// socket.onmessage = (event) => {
//     alert(`[message] Данные получены с сервера: ${event.data}`)
// }

// socket.onclose = (event) => {
//     if (event.wasClean) {
//         alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`)
//     } else {
//         // например, сервер убил процесс или сеть недоступна
//         // обычно в этом случае event.code 1006
//         alert("[close] Соединение прервано")
//     }
// }

// socket.onerror = (error) => {
//     alert(`[error]`)
// }
