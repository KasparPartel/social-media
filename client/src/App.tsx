import "./components/commonClasses.css"
import "./constants.css"
import Login from "./components/login/Login"
import { Registration, AdditionalInfo } from "./components/registration/Registration"
import { Route, Routes, Navigate } from "react-router-dom"
import MainContainer from "./components/main-container/MainContainer"
import { UserProfile } from "./components/user-information/UserInformation"
import { ErrorNotFound } from "./components/error-404/ErrorNotFound"
import { ErrorGeneral } from "./components/error-general/ErrorGeneral"
import { GroupPage } from "./components/single-group/Group"
import { GroupsPage } from "./components/groups/GroupsPage"
import { UserListPage } from "./components/user-list/UserListPage"

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
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/group/:paramId" element={<GroupPage />} />
                <Route path="/userlist" element={<UserListPage />} />
            </Route>
            <Route path="/internal-error" element={<ErrorGeneral />} />
            <Route path="/error-not-found" element={<ErrorNotFound />} />
            <Route path="*" element={<ErrorNotFound />} />
        </Routes>
    )
}
