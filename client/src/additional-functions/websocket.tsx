export let ws: WebSocket

type EventType = "join" | "leave" | "message" | "eventNotification"

export interface BasePayload {
    event: EventType
    payload: Message | ServerMessage | ServerMessage[] | GroupChatJoin | UserChatJoin | EventNotification
}

interface Message {
    text: string
}

export interface ServerMessage extends Message {
    firstName: string
    lastName: string
    creationDate: number
}

interface GroupChatJoin {
    groupId: number
}

interface UserChatJoin {
    userId: number
}

interface EventNotification {
    eventName: string
}

export function CreateWebsocket() {
    if (!ws || ws.readyState !== 1) {
        ws = new WebSocket(`ws://localhost:8080/ws`)
        ws.onopen = (e) => {
            console.log("[open] Соединение установлено")
        }
        ws.onerror = (error) => {
            console.log(`${error}`)
        }
        ws.onmessage = (event) => {
            console.log(`[message] Данные получены с сервера: ${event.data}`)
        }
        ws.onclose = (event) => {
            if (event.wasClean) {
                console.log(
                    `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`,
                )
            } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                console.log("[close] Соединение прервано")
            }
        }
    }
    console.log(ws)
}
