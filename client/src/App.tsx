import "./components/commonClasses.css"
import "./constants.css"
import Login from "./components/login/Login"
import { Registration, AdditionalInfo } from "./components/registration/Registration"
import { Route, Routes, Navigate } from "react-router-dom"
import MainContainer from "./components/main-container/MainContainer"
import { UserProfile } from "./components/user-information/UserInformation"
import { ErrorNotFound } from "./components/error-404/ErrorNotFound"
import { ErrorGeneral } from "./components/error-general/ErrorGeneral"

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    localStorage.getItem("id") === null ? (
                        <Navigate replace to="/login" />
                    ) : (
                        <Navigate replace to={`/user/${localStorage.getItem("id")}`} />
                    )
                }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/additional-registration" element={<AdditionalInfo />} />
            <Route element={<MainContainer />}>
                <Route path="/user/:paramId" element={<UserProfile />} />
            </Route>
            <Route path="/internal-error" element={<ErrorGeneral />} />
            <Route path="*" element={<ErrorNotFound />} />
        </Routes>
    )
}
