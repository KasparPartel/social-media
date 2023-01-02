import React, {useState} from "react";
import './style.css'
const Login: React.FC = () =>  { // Defining the 'login page' view
    // Use 'email' and 'passowrd' to get user inserted credentials
    /*
    let kek = document.getElementsByClassName("view-button__login-form")[0]

    if (kek != undefined) {
        kek.removeAttribute("hidden")
        document.getElementsByClassName("view-button__login-form")[0].setAttribute("hidden", "")
    }
    */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const [updated, setUpdated] = useState();
    

    const handleClick = () => {
        setUpdated(updated);
        console.log(email, password)
    }

    return (
    <div className="login-form">
        <input placeholder="Email" 
            type={"text"}
            className={"login-form__email"} 
            onChange={function(event) {setEmail(event.target.value)}}
            /> <br/>
        
        <input 
            placeholder="Password"
            type={"password"} 
            className={"login-form__password"}
            onChange={function(event) {setPassword(event.target.value)}}
            /><br/>

        <button className={"login-form__submit"} onClick={handleClick}>Login</button>
    </div>
    );
}

const Register: React.FC = () => { // Defining the 'registration page' view 
    // Use 'email', 'password', 'fName', 'lName', 'bio' (aka 'about me'), 'bday' (aka 'date of birth') to get user inserted credentials

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fName, setfname] = useState('');
    const [lName, setlname] = useState('');
    const [bday, setBday] = useState('');

    // Optional aka stage two
    const [bio, setBio] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const [username, setUsername] = useState('')

    // Change registration page
    let [stage, setStage] = useState("")
    let [stage2, setStage2] = useState("none")

    const handleClick = () => {
        console.log(email, password, fName, lName, bday) // Second stage of registration
        setStage("none")
        setStage2("")

    }

    const handleSecondClick = (e) => {
        console.log(bio, selectedImage, username)
        if (e) {
            // Continue
        } else {
            // Back
            setStage("")
            setStage2("none")
        }
    }



    return (
    <div>
        <div className={"regi-form"} style={{display: stage}}>
                <input
                    placeholder="Email"
                    type={"email"} 
                    className={"regi-form__email"}
                    onChange={function(event) {setEmail(event.target.value)}}
                /> <br/>

                <input 
                    placeholder="Password"
                    type={"password"} 
                    className={"regi-form__password"}
                    onChange={function(event) {setPassword(event.target.value)}}
                /> <br/>

                <input 
                    placeholder="First Name"
                    type={"text"} 
                    className={"regi-form__Fname"}
                    onChange={function(event) {setfname(event.target.value)}}
                /><br/>

                <input 
                    placeholder="Last Name"
                    type={"text"} 
                    className={"regi-form__Lname"}
                    onChange={function(event) {setlname(event.target.value)}}
                /><br/>


                <input
                    placeholder="Birthday"
                    type={"date"} 
                    className={"regi-form__birthday"}
                    onChange={function(event) {setBday(event.target.value)}}
                /><br/>


            <button className={"regi-form__submit"} onClick={handleClick}>Register</button>
        </div>

        <div className={"regi-form__second-stage"} style={{display : stage2}}>
            <div className={"regi-form__second-stage__avatar"}>
                    {selectedImage && (
                    <div>
                    <img alt="not found" width={"250px"} height={"250px"} src={URL.createObjectURL(selectedImage)} />
                    <br />
                    <button onClick={()=>setSelectedImage(null)}>Remove</button>
                    </div>
                )}
                <br />
                <br /> 
                <input
                    type="file"
                    onChange={(event) => {
                    setSelectedImage(event.target.files[0]);
                    }}
                />
            </div>
            <input 
                placeholder="Username"
                type={"text"}
                className={"regi-form__second-stage__username"}
                onChange={function(event) {setUsername(event.target.value)}}
            />
            <input
                placeholder="About Me"
                type={"text"} 
                className={"regi-form__second-stage__bio"}
                onChange={function(event) {setBio(event.target.value)}}
            /><br/>

        <div className={"regi-form__second-stage__button"}>
            <button className={"regi-form__second-stage__button__back"} onClick={() => handleSecondClick(false)}>Back</button>
            <button className={"regi-form__second-stage__button__continue"} onClick={() => handleSecondClick(true)}>Continue</button>
        </div>
        </div>
    </div>
    );
}


const App = () => { // Shows the registraton/login view, plus two buttons that lets you change between them
    const [view, setView] = useState(1)
    const [regiState, setRegi] = useState("")
    const [loginState, setLogin] = useState("none")
    return (
        <div className={"view-button"}> 
            {view === 1 ? <Login/> : ''}
            {view === 2 ? <Register/> : ''}

                <button 
                    style={{display: regiState}}
                    className={"view-button__regi-form"}
                    onClick={() => {
                            setRegi("none")
                            setLogin("")
                            setView(2)
                        
                    }}
                >No account yet?</button>

                <button 
                    style={{display: loginState}}
                    className={"view-button__login-form"}
                    onClick={() => {
                            setRegi("")
                            setLogin("none")
                            setView(1)
                        
                    }}
                >Sign in</button>
            
        </div>

    );
}

export default App;
