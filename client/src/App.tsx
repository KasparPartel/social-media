import "./components/commonClasses.css"
import "./constants.css"
import Login from "./components/login/login"
<<<<<<< HEAD
import { AdditionalInfo, Registration } from "./components/registration/registration"
import { useState } from "react"
=======
import { Registration, AdditionalInfo } from "./components/registration/registration"
>>>>>>> develop
import { Route, Routes } from "react-router-dom"
import Navigation from "./components/header/header"
import CreatePost from "./components/create-post/createPost"
import PostList from "./components/user-post/postList"
import { UserProfile } from "./components/user-information/user-information"
import FollowingFollowers from "./components/followers-following/following-followers"

// Shows the registration/login view, plus two buttons that lets you change between them
export default function App() {
    return (
<<<<<<< HEAD
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
                <Route path="/" element={<CreatePost />} />
                <Route path="/postlist" element={<PostList />} />
            </Routes>
        </IdContext.Provider>
=======
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/additional-registration" element={<AdditionalInfo />} />
            <Route element={<Navigation />}>
                <Route path="/main" element={<h1>This is a main page</h1>} />
            </Route>
            <Route path="/user/:paramId" element={<UserProfile />} />
            <Route path="/test" element={<FollowingFollowers id={2} />} />
            <Route path="/internal-error" element={<h1>Error 500</h1>} />
            <Route path="/*" element={<h1>Error 404</h1>} />
        </Routes>
>>>>>>> develop
    )
}
