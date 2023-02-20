import { IdContext } from "./components/models"
import Login from "./components/login/login"
import { Registration, AdditionalInfo } from "./components/registration/registration"
import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import Navigation from "./components/header/header"
import { UserInfo } from "./components/user-information/user-information"
import { GetUserInfo } from "./components/additional-functions/profile"


// Shows the registration/login view, plus two buttons that lets you change between them
export default function App() {
    const [id, setId] = useState<number>(0)

    return (
        <IdContext.Provider value={{ id, setId }}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/additional-registration" element={<AdditionalInfo />} />
                <Route path="/not-found" element={<h1>Error 404</h1>} />
                <Route path="/internal-error" element={<h1>Error 500</h1>} />
                <Route element={<Navigation />}>
                    <Route path="/main" element={<h1>This is a main page</h1>} />
                </Route>
                <Route path="/" element={<UserInfo isMyProfile={true} usr={GetUserInfo(id)} />} />
            </Routes>
        </IdContext.Provider>
    )
}
