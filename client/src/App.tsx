import React, {useState} from "react";
import './style.css'
const Login: React.FC = () =>  { // Defining the 'login page' view
    // Use 'email' and 'passowrd' to get user inserted credentials

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const [updated, setUpdated] = useState();
    

    const handleClick = () => {
        setUpdated(updated);
        console.log(email, password)
    }

    return (
    <div className="login-form">
        Email: <input 
            type={"text"}
            className={"login-form__email"} 
            onChange={function(event) {setEmail(event.target.value)}}
            /> <br/>
        
        Password: <input 
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
    const [bio, setBio] = useState('');
    const [bday, setBday] = useState('');

    const [updated, setUpdated] = useState();
    

    const handleClick = () => {
        setUpdated(updated);
        console.log(email, password, fName, lName, bio, bday)
    }

    return (
    <div className="register-form">
            Email: <input 
                type={"email"} 
                className={"regi-form__email"}
                onChange={function(event) {setEmail(event.target.value)}}
            /> <br/>

            Password: <input 
                type={"password"} 
                className={"regi-form__password"}
                onChange={function(event) {setPassword(event.target.value)}}
            /> <br/>

            First Name: <input 
                type={"text"} 
                className={"regi-form__Fname"}
                onChange={function(event) {setfname(event.target.value)}}
            /><br/>

            Last Name: <input 
                type={"text"} 
                className={"regi-form__Lname"}
                onChange={function(event) {setlname(event.target.value)}}
            /><br/>

            About Me: <input 
                type={"text"} 
                className={"regi-form__aboutMe"}
                onChange={function(event) {setBio(event.target.value)}}
            /><br/>

            Birthday: <input 
                type={"date"} 
                className={"regi-form__birthday"}
                onChange={function(event) {setBday(event.target.value)}}
            /><br/>

        <button className={"regi-form_submit"} onClick={handleClick}>Register</button>
    </div>
    );
}
const App = () => { // Shows the registraton/login view, plus two buttons that lets you change between them
    let [view, setView] = useState(1)
    return (
        <div>
            <div className="form-selector">
                <div 
                    className="form-selector__login-button"
                    onClick={()=> {setView(1)}}
                >Click here to login</div>
                <div
                    className="form-selector__regi-button"
                    onClick={() => {setView(2)}}
                >Click here to register</div>
            </div> 

            {view === 1 ? <Login/> : ''}
            {view === 2 ? <Register/> : ''}
        </div>

    );
}



export default App;
