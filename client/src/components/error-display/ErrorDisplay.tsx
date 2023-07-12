import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import { ErrorResponse } from "../models"
import "./errorDisplay.css"

export type ErrorsDisplayType = (errors: ErrorResponse[]) => void
export type ErrorDisplayType = (errors: ErrorResponse) => void

type ErrorsDisplayContextType = {
    displayErrors: ErrorsDisplayType
    displayOneError: ErrorDisplayType
}

const ErrorsContext = React.createContext<ErrorsDisplayContextType | null>(null)

export function useErrorsContext() {
    return useContext(ErrorsContext)
}

/**
 * Displays any errors that are inserted to the component via context
 *
 * Usage:
 * Wrap this component around the main page and import useErrorsContext where you want to throw errors.
 * const {displayErrors} = useErrorsContext();
 * displayErrors(errors)
 *
 * @param children
 * @returns Displays errors in the top right corner of the page
 */
export function ErrorDisplay({ children }) {

    const [errors, setErrors] = useState<ErrorResponse[]>([])

    const displayErrors = (newErrors: ErrorResponse[]) => {
        setErrors((prev) => [...newErrors, ...prev])
    }

    const displayOneError = (newError: ErrorResponse) => {
        setErrors((prev) => [newError, ...prev])
    }

    return (
        <>
            <ul className="errors-display">
                {errors.map((error, key) => {
                    return (
                        <li className="errors-display_card" key={key}>
                            <button
                                type="button"
                                onClick={() => {
                                    setErrors((prev) => {
                                        return [
                                            ...prev.slice(0, key),
                                            ...prev.slice(key + 1, prev.length),
                                        ]
                                    })
                                }}
                                className="errors-display_card__close-button"
                            >
                                X
                            </button>
                            <div className="errors-display_card__code">Error {error.code}:</div>
                            <div className="errors-display_card__description">
                                {error.description}
                            </div>
                        </li>
                    )
                })}
            </ul>
            <ErrorsContext.Provider value={{ displayErrors, displayOneError }}>
                {children}
            </ErrorsContext.Provider>
        </>
    )
}

ErrorDisplay.propTypes = {
    children: PropTypes.node.isRequired,
}
