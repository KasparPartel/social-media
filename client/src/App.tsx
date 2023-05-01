import "./components/commonClasses.css"
import "./constants.css"
import Login from "./components/login/login"
import { Registration, AdditionalInfo } from "./components/registration/registration"
import { Route, Routes } from "react-router-dom"
import Header from "./components/header/header"
import { UserProfile } from "./components/user-information/user-information"
import FollowingFollowers from "./components/followers-following/following-followers"
import PostList from "./components/user-post/postList"

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/additional-registration" element={<AdditionalInfo />} />
            <Route element={<Header id={0} />}>
                <Route path="/user/:paramId" element={<UserProfile />} />
                <Route path="/test" element={<FollowingFollowers />} />
            </Route>
            <Route path="/user/:paramId/posts" element={<PostList />} />
            <Route path="/internal-error" element={<h1>Error 500</h1>} />
            <Route path="/*" element={<h1>Error 404</h1>} />
        </Routes>
    )
}
