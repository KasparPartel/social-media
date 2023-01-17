import { useState } from "react";
import Login from "./components/login/login"
import { Registration, AdditionalInfo } from "./components/registration/registration"

export interface FormProps {
    view: (b: number) => void;
}

export default function App() { // Shows the registraton/login view, plus two buttons that lets you change between them
    const [view, setView] = useState(0)

    return (
        <>
            {view === 0 ? <Login view={setView} /> : ''}
            {view === 1 ? <Registration view={setView} /> : ''}
            {view === 2 ? <AdditionalInfo /> : ''}
        </>
    );
}

// <BrowserRouter>
//     <Routes>
//         <Route path="/" element={<App />}></Route>
//     </Routes>
// </BrowserRouter>