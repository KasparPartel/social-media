import { IdContext } from './components/models'
import Login from "./components/login/login"
import { Registration, AdditionalInfo } from "./components/registration/registration"
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

export default function App() { // Shows the registraton/login view, plus two buttons that lets you change between them
    const [id, setId] = useState<number>(0)

    return (
        <IdContext.Provider value={{ id, setId }}>
            <Routes>
                <Route path="/login" element={
                    <Login />
                } />
                <Route path="/registration" element={
                    <Registration />
                } />
                <Route path="/additional-registration" element={
                    <AdditionalInfo />
                } />
                <Route path="/main" element={
                    <h1>This is a main page</h1>
                } />
                <Route path="/not-found" element={
                    <h1>Error 404</h1>
                } />
                <Route path="/internal-error" element={
                    <h1>Error 500</h1>
                } />
            </Routes>
        </IdContext.Provider>
    );
}