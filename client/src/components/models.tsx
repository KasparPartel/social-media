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

export interface PostFormFields {
    privacy: string
    body: string
    attachments: string[]
    authorizedFollowers?: number[]
}

export interface RequestProps {
    e: React.FormEvent<HTMLFormElement>
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
<<<<<<< HEAD

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
=======
>>>>>>> develop
