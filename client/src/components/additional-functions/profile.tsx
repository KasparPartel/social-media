import { User } from "../models"
import { fetchHandlerNoBody } from "./fetchHandler"

export function GetUserInfo(id) {
    const usr: User = {
        id: 0,
        avatarId: 0,
        firstName: "",
        lastName: "",
        email: "",
        login: "",
        aboutMe: "",
        dateOfBirth: 0,
        isPublic: false,
        password: "REDACTED",
    }

    fetchHandlerNoBody(`http://localhost:8080/user/${id}`, "GET")
        .then(response => {
            if (response.ok) {
            response.json().then(res => {
                for (const key in usr) {
                    usr[key] = res.data[key]
                }                
            });
        }
    })

    return usr
}
