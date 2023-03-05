// Dissable heared buttons
// Since it's only for header, disable buttons by their place on the header (and enable others)
// 0 - profile
// 1 - groups
// 2 - Users
// 3 - notidications
export function disable(nr: number) { 
    const buttons = document.getElementsByClassName("button navigation__button")

    for (let i = 0; i < buttons.length; i++) {
        if (i === nr) {
            (buttons[i] as HTMLButtonElement).disabled = true
        } else {
            (buttons[i] as HTMLButtonElement).disabled = false
        }
    }
}