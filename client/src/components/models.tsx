import { NavigateFunction } from "react-router-dom"

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

export interface AdditionalInfoFormFields {
    avatar: string
    login: string
    aboutMe: string
}

export interface RequestProps {
    e?: React.FormEvent<HTMLFormElement>
    setErrorArr?: (errs: ErrorResponse[]) => void
    navigate: NavigateFunction
    image?: Blob
    id?: string
}

export interface ServerResponse {
    data: null | User
    errors: ErrorResponse[]
}

export interface ErrorResponse {
    code: number
    description?: string
}

export interface Post {
    id: number      // id of current post
    userId: number      // creator post id
    login?: string // creator post login
    firstName?: string
    lastName?: string
    text: string
    attachments: string[] // array of image/gif encoded with base64
    creationDate: number      // milliseconds timestamp
}

export interface User {
    id?: number
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

export interface PostComment {
    dateOfCreation: number
    login: string
    parentId: number
    text: string
    userId: number
}
