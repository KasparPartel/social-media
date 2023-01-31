import React from "react";
import "./navigation.css"
export default function Navigation() {
    return (
        <header className={"header"}>
            <nav className={"navigation"}>  
                <input 
                    type={"button"} 
                    className={"navigation__logout"}
                    value={"Logout"}
                    onClick={() => {window.location.assign("/")}}
                />
                <input 
                    type={"button"} 
                    className={"navigation__users"}
                    value={"Users"}
                    onClick={() => {window.location.assign("#/users")}}
                />
                <input 
                    type={"button"} 
                    className={"navigation__groups"}
                    value={"Groups"}
                    onClick={() => {window.location.assign("#/groups")}}
                />
                <input 
                    type={"button"} 
                    className={"navigation__notifications"}
                    value={"Notifications"}
                    onClick={() => {window.location.assign("#/notifications")}}
                />
                <input 
                    type={"button"} 
                    className={"navigation__profile"}
                    value={"Profile"}
                    onClick={() => {window.location.assign("#/profile")}}
                />
            </nav>
        </header>
    );
}