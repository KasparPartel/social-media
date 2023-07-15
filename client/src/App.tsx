import "./commonClasses.css"
import "./constants.css"
import Login from "./pages/login/Login"
import { Registration, AdditionalInfo } from "./pages/registration/Registration"
import { Route, Routes, Navigate } from "react-router-dom"
import MainContainer from "./pages/main-container/MainContainer"
import { UserProfile } from "./pages/user-information/UserInformation"
import { ErrorNotFound } from "./pages/error-404/ErrorNotFound"
import { ErrorGeneral } from "./pages/error-general/ErrorGeneral"
import { GroupPage } from "./pages/single-group/Group"
import { GroupsPage } from "./pages/groups/GroupsPage"
import { UserListPage } from "./pages/user-list/UserListPage"
import { Notifications } from "./pages/notifications/Notifications"

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
                <Route path="/notifications" element={<Notifications />} />
            </Route>
            <Route path="/internal-error" element={<ErrorGeneral />} />
            <Route path="/error-not-found" element={<ErrorNotFound />} />
            <Route path="*" element={<ErrorNotFound />} />
        </Routes>
    )
}
