const newPassword = document.getElementById('newPassword')
const faEye = document.getElementById('faEye')
const faEyeSlash = document.getElementById('faEyeSlash')

faEye.onclick = () => {
    faEye.classList.add('disappear')
    faEyeSlash.classList.add('appear')
    newPassword.type = "text"
}

faEyeSlash.onclick = () => {
    faEye.classList.remove('disappear')
    faEyeSlash.classList.remove('appear')
    newPassword.type = "password"
}


const newPasswordInput = document.getElementById('newPassword')
const passwordError = document.getElementById('passwordError')
const confirmPasswordInput = document.getElementById('confirmPassword')
const passwprdErorrs = document.getElementById('passwordErorrs')

function isvaildPassword() {
    const newPassword = newPasswordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (newPassword.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters"
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/(?=.*[A-Z])/.test(newPassword)) {
        passwordError.textContent = "The password must contain at least one uppercase letter."
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/(?=.*[a-z])/.test(newPassword)) {
        passwordError.textContent = "The password must contain at least one lowercase letter."
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/(?=.*\d)/.test(newPassword)) {
        passwordError.textContent = "The password must contain at least one digit."
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
        passwordError.textContent = "The password must contain at least one special character"
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (newPassword !== confirmPassword) {
        passwordError.textContent = "These passwords are not the same"
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    passwordError.textContent = ""
    passwprdErorrs.classList.remove("appearPasswordErrors")
    return true
}

newPasswordInput.oninput = isvaildPassword
confirmPasswordInput.oninput = isvaildPassword

const apiKey = "d89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2"


async function getNewPassword() {
    const token = localStorage.getItem('data')
    try {

        const response = await fetch("https://restaurantapi.stepacademy.ge/api/auth/reset-password", {
            method: "PUT",
            headers: {
                'accept': 'text/plain',
                'X-STEP-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                newPassword: newPasswordInput.value
            })
        })

        const body = await response.text()

        if (!response.ok) {
            console.log("STATUS:", response.status)
            console.log("BODY:", body)
            let title = "Error"
            let text = "ვერ მოხერხდა პაროლის შეცვლა"

            try {
                const data = JSON.parse(body)
                title = data.title || title
                text = data.detail || text
            } catch {
                text = body || text
            }

            showToast(title, text)
            return
        }

        localStorage.removeItem("data")
        sessionStorage.setItem('resetPasswordSuccess', 'true')
        window.location.href = "logIn.html"
    } catch (err) {
        console.log(err.message);
    }
}

const toast = document.getElementById('toast')
const toastTitle = document.getElementById('toastTitle')
const toastText = document.getElementById('toastText')

let timer

function showToast(title, text) {
    toastTitle.textContent = title
    toastText.textContent = text

    toast.classList.add('return')
    toast.classList.remove('back')

    clearTimeout(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}

const toastClose = document.getElementById('toastClose')

toastClose.onclick = () => {
    toast.classList.remove('return')
    toast.classList.add('back')
}


const resetBtn = document.getElementById('btn')
const form = document.querySelector('form')

form.onsubmit = async (e) => {
    e.preventDefault()
    if (!isvaildPassword()) return
    resetBtn.textContent = 'Resetting'
    resetBtn.disabled = true
    await getNewPassword()
    resetBtn.textContent = 'Reset Password'
    resetBtn.disabled = false
}