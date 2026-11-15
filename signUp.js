const passwordInput = document.getElementById("password")
const faEye = document.querySelector('.fa-eye')
const faEyeSlash = document.querySelector('.fa-eye-slash')

faEye.onclick = () => {
    passwordInput.type = "text"
    faEye.classList.add('disappear')
    faEyeSlash.classList.add('appear')
}

faEyeSlash.onclick = () => {
    passwordInput.type = "password"
    faEye.classList.remove('disappear')
    faEyeSlash.classList.remove('appear')
}

let createBtn = document.getElementById('createBtn')
let emailInput = document.getElementById('email')
let firstNameInput = document.getElementById('name')
let lastNameInput = document.getElementById('lastName')


let inputs = [emailInput, firstNameInput, lastNameInput, passwordInput]


const passwordError = document.getElementById('passwordError')

function validatePassword() {
    let password = passwordInput.value

    if (password.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters"
        return false
    }
    if (!/^(?=.*[A-Z]).+$/.test(password)) {
        passwordError.textContent = "Password must contain at least one uppercase letter"
        return false
    }
    if (!/^(?=.*[a-z]).+$/.test(password)) {
        passwordError.textContent = "Password must contain at least one lowercase letter"
        return false
    }

    if (!/^(?=.*\d).+$/.test(password)) {
        passwordError.textContent = "Password must contain at least one number"
        return false
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        passwordError.textContent = "Password must contain at least one special character"
        return false
    }

    passwordError.textContent = ""
    return true
}

passwordInput.oninput = validatePassword

const form = document.querySelector('form')

form.onsubmit = async (e) => {
    e.preventDefault()
    let hasError = false

   

    inputs.forEach(input => {
        const label = document.querySelector(`label[for='${input.id}']`)

        if (input.value.trim() === "") {
            input.classList.add("weCouldNotFindTheText")
            label?.classList.add("weCouldNotFindTheText")
            hasError = true

        } else {
            input.classList.remove("weCouldNotFindTheText")
            label?.classList.remove("weCouldNotFindTheText")
        }
    });


    const isPasswordValid = validatePassword()

    if (hasError || !isPasswordValid) {
        return
    }
    
    createBtn.textContent = 'Creating account...'
    createBtn.disabled = true
   
    await register()
    createBtn.textContent = 'Create Account'
    createBtn.disabled = false
}

const apiKey = "d89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2"
const forError = document.getElementById('forError')


async function register() { 
    try {
        const responce = await fetch("https://restaurantapi.stepacademy.ge/api/auth/register", {
            method: "POST",
            headers: {
                'accept': 'text/plain',
                'X-STEP-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            })
        })

        const body = await responce.text()

        if (!responce.ok) {
            let title = "Error"
            let message = "ვერ მოხერხდა რეგისტრაცია"

            try {
                const data = JSON.parse(body)
                title = data.title || title
                message = data.detail || message
            } catch {
                message = body || message
            }

            showToast(title, message)  
            return
        }

        localStorage.setItem('tokensignUp', body)
        sessionStorage.setItem("verifyEmail", emailInput.value);
        sessionStorage.setItem('signUpSuccess', 'true')
        console.log(body);
        
        window.location.href = "verifity.html"
    } catch (err) {
        console.log(err.message);
    }
}

const toast = document.getElementById('toast')
const toastCloseBtn = document.getElementById('toastClose')
const toastTiTle = document.getElementById('toastTitle')
const toastText = document.getElementById('toastText')

let timer

function showToast(title, text) {
    toastTiTle.textContent = title
    toastText.textContent = text

    toast.classList.remove('back')
    toast.classList.add('return')

    clearTimeout(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}

toastCloseBtn.onclick = () => {
    toast.classList.remove('return')
    toast.classList.add('back')
}