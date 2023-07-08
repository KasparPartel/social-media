import { NavigateFunction } from "react-router-dom"

export type FormFields =
    | LoginFormFields
    | RegistrationFormFields
    | ProfileSettingsUpdateFormFields
    | PostFormFields
    | MakeGroupFormFields
    | GroupUserInvitations
    | GroupFormFields
    | EventStatus

interface GroupUserInvitations {
    users: number[]
}

export interface LoginFormFields {
    login: string
    password: string
}

export interface RegistrationFormFields {
    email: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth: number
}

export interface ProfileSettingsUpdateFormFields {
    avatar?: string // base64 encoded
    login?: string
    aboutMe?: string
    isPublic?: string
}

export interface MakeGroupFormFields {
    title: string
    description: string
}

export interface PostFormFields {
    privacy: number
    text: string
    attachments: string[]
    authorizedFollowers?: number[]
}

export interface GroupFormFields {
    text: string
    isEvent: boolean
    title?: string
    datetime?: number // milliseconds
}

export interface RequestProps {
    e?: React.FormEvent<HTMLFormElement>
    setErrorArr?: (errs: ErrorResponse[]) => void
    navigate: NavigateFunction
    image?: Blob
    id?: string
}

export interface ProfileSettingsUpdateRequestProps {
    e: React.FormEvent<HTMLFormElement>
    id: number
    navigate: NavigateFunction
    avatar: Blob
}

export interface ServerResponse<T> {
    data: null | T
    errors: ErrorResponse[]
}

export interface ErrorResponse {
    code: number
    description?: string
}

export interface Post {
    id: number // id of current post
    userId: number // creator post id
    login?: string // creator post login
    firstName?: string
    lastName?: string
    text: string
    attachments: string[] // array of image/gif encoded with base64
    creationDate: number // milliseconds timestamp
}

export interface User {
    id: number
    avatar: string
    email: string
    login: string
    password?: string
    firstName: string
    lastName: string
    aboutMe: string
    dateOfBirth: number
    isPublic: boolean
    followStatus?: number
}

export interface Group {
    id: number
    title: string
    description: string
    joinStatus: number // 1 - not joined, 2 - requested, 3 - joined
    isOwner: boolean
}

export interface PostComment {
    id?: number
    creationDate: number
    login: string
    parentId: number
    text: string
    userId: number
    attachments: string[]
}

export interface GroupFetchedPost {
    id: number
    userId: number
    text: string
}

export interface GroupFetchedEvent {
    id: number
    userId: number
    text: string
    title: string
    datetime: number
    isGoing: number
}

export interface EventStatus {
    isGoing: number
}

export interface BasePayload<
    T = Message | ServerMessage | ServerMessage[] | ChatJoin | EventNotification,
> {
    eventType: string
    payload: T
}

export interface Message {
    content: string
}

export interface ServerMessage {
    id: number
    userId: number
    chatId: number
    creationDate: number
    firstName: string
    lastName: string
    text: string
}

export interface ChatJoin {
    id: number
    isGroup: boolean
}

export interface EventNotification {
    eventName: string
}
