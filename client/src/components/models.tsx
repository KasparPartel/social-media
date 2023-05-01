import { createContext } from "react"
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
    parentId: number
    login: string
    userId: number
    postId: number
    title: string
    text: string
    dateOfCreation: number
    visibility: string
    attachments: string[]
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
