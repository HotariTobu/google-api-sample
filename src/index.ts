import { init, signIn, signOut } from "./api"
import calendar from "./calendar"
import gmail from "./gmail"
import people from "./people"

const signInButton = document.querySelector<HTMLButtonElement>('#sign-in-button')
if (signInButton === null) {
    throw 'sign-in-button'
}

const otherButtons = document.querySelectorAll<HTMLButtonElement>('.requires-sign-in')


document.addEventListener('DOMContentLoaded', async function () {
    signInButton.disabled = true
    otherButtons.forEach(function (element) {
        element.disabled = true
    })
    
    await init

    signInButton.disabled = false
})

signInButton.addEventListener('click', async function () {
    const tokenResponse = await signIn()
    if ('error' in tokenResponse) {
        throw tokenResponse
    }

    signInButton.textContent = 'REFRESH'
    document.querySelectorAll<HTMLButtonElement>('.requires-sign-in').forEach(function (element) {
        element.disabled = false
    })
})

document.getElementById('sign-out-button')?.addEventListener('click', async function () {
    await signOut()

    signInButton.textContent = 'SING-IN'
    document.querySelectorAll<HTMLButtonElement>('.requires-sign-in').forEach(function (element) {
        element.disabled = true
    })
})

document.getElementById('gmail-button')?.addEventListener('click', gmail)
document.getElementById('people-button')?.addEventListener('click', people)
document.getElementById('calendar-button')?.addEventListener('click', calendar)
