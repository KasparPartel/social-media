import "./navigation.css"
export default function Navigation() { 
    return (
        <header className={"header"}>
            <nav className={"navigation"}> 
                <nav className={"navigation-left"}>
                    <input 
                        type={"button"} 
                        className={"navigation__profile"}
                        value={"Profile"}
                        onClick={() => {window.location.assign("#/profile")}}
                    />

                    <input 
                        type={"button"} 
                        className={"navigation__groups"}
                        value={"Groups"}
                        onClick={() => {window.location.assign("#/groups")}}
                    />

                    <input 
                        type={"button"} 
                        className={"navigation__users"}
                        value={"Users"}
                        onClick={() => {window.location.assign("#/users")}}
                    />
                    
                    <input 
                        type={"button"} 
                        className={"navigation__notifications"}
                        value={"Notifications"}
                        onClick={() => {window.location.assign("#/notifications")}}
                    />
                </nav> 
                <nav className={"navigation-right"}>
                    <input
                        type={"button"} 
                        className={"navigation__logout"}
                        value={"Logout"}
                        onClick={() => {window.location.assign("/")}}
                    />
            </nav>
              
            </nav>

        </header>
    );
}
