import { useState } from "react";
import { IdContext } from './components/models'
import Login from "./components/login/login"
import { Registration, AdditionalInfo } from "./components/registration/registration"

export default function App() { // Shows the registraton/login view, plus two buttons that lets you change between them
    const [view, setView] = useState(0)
    const [id, setId] = useState(0)

    return (
        <IdContext.Provider value={{ id, setId }}>
            {view === 0 ? <Login setViewExtention={setView} /> : ''}
            {view === 1 ? <Registration setViewExtention={setView} /> : ''}
            {view === 2 ? <AdditionalInfo /> : ''}
        </IdContext.Provider>
    );
}

// <BrowserRouter>
//     <Routes>
//         <Route path="/" element={<App />}></Route>
//     </Routes>
// </BrowserRouter>