import { BasePayload, EventNotification, ServerMessage } from "../components/models"

export const EVENT_TYPES = ["join", "leave", "message", "eventNotification"]

export interface wsDataSourceProps {
    chat: ServerMessage[]
    eventNotification: EventNotification[]
}

export class WebSocketService {
    private ws: WebSocket | null = null
    private setWsDataSource: React.Dispatch<React.SetStateAction<wsDataSourceProps>>
    public isConnected = false

    constructor(wsDataState: React.Dispatch<React.SetStateAction<wsDataSourceProps>>) {
        this.setWsDataSource = wsDataState
    }

    private setUpWebSocket(url: string): void {
        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
            this.isConnected = true
        }

        this.ws.onmessage = (e: MessageEvent) => {
            const data: BasePayload<ServerMessage | ServerMessage[] | EventNotification> = e.data
                ? JSON.parse(e.data)
                : {}

            if (data.eventType && EVENT_TYPES.includes(data.eventType)) {
                switch (data.eventType) {
                    case EVENT_TYPES[2]: // "message"
                        handleNewChatMessage(this.setWsDataSource, data.payload)
                        break
                    case EVENT_TYPES[3]: // "eventNotification"
                        this.setWsDataSource((prev) => {
                            const temp = Object.assign({}, prev)
                            temp.eventNotification.push(data.payload as EventNotification)
                            return temp
                        })
                        break
                }
            }
        }

        this.ws.onclose = () => {
            this.isConnected = false
        }
    }

    public connect(url: string): void {
        if (!this.ws || !this.isConnected) {
            this.setUpWebSocket(url)
        }
    }

    public send(message: string): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message)
            return
        }
        console.log("WebSocket connection is not open")
    }

    public clearChat(): void {
        this.setWsDataSource((prev) => {
            const temp = Object.assign({}, prev)
            temp.chat = []
            return temp
        })
    }

    public close(): void {
        if (this.ws) {
            this.ws.close()
        }
    }
}

function handleNewChatMessage(
    setData: React.Dispatch<React.SetStateAction<wsDataSourceProps>>,
    data: ServerMessage | ServerMessage[] | EventNotification,
) {
    setData((prev) => {
        const temp = Object.assign({}, prev)
        if (Array.isArray(data)) {
            temp.chat = data as ServerMessage[]
            return temp
        }
        temp.chat.push(data as ServerMessage)
        return temp
    })
}
