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
    e: React.FormEvent<HTMLFormElement>
    setErrorArr?: (errs: ErrorResponse[]) => void
    setId?: (id: number) => void
    navigate: NavigateFunction
    image?: Blob
    id?: number
}

export interface serverResponse {
    data: null | User
    errors: ErrorResponse[]
}

export interface ErrorResponse {
    code: number
    description: string
}

export interface User {
    id: number
    avatarId: number
    email: string
    login: string
    password: string
    firstName: string
    lastName: string
    aboutMe: string
    dateOfBirth: number
    isPublic: boolean
}

export interface UserIdContext {
    id: number
    setId: (id: number) => void
}

export const defaultId: UserIdContext = {
    id: 0,
    setId: () => {
        return
    },
}

export const IdContext = createContext(defaultId)
