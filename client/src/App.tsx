import "./components/commonClasses.css"
import "./constants.css"
import Login from "./components/login/login"
import { Registration, AdditionalInfo } from "./components/registration/registration"
import { Route, Routes } from "react-router-dom"
import Header from "./components/header/header"
import { UserProfile } from "./components/user-information/user-information"
import PostList from "./components/user-post/PostList"
import CreatePost from "./components/create-post/createPost"
import CreateGroup from "./components/create-group/createGroup"
import { GroupsPage } from "./components/groups/groupsPage"

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/additional-registration" element={<AdditionalInfo />} />
            <Route element={<Header id={0} />}>
                <Route path="/user/:paramId" element={<UserProfile />} />
                <Route path="/post-test" element={<CreatePost />} />
                <Route path="/groups" element={<GroupsPage />} />
            </Route>
            <Route path="/user/:paramId/posts" element={<PostList />} />
            <Route path="/internal-error" element={<h1>Error 500</h1>} />
            <Route path="/*" element={<h1>Error 404</h1>} />
        </Routes>
    )
}
