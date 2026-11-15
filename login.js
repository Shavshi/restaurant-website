const password = document.getElementById('password')
const faEye = document.getElementById('fa-eye')
const faEyeSlash = document.getElementById('fa-eye-slash')

faEye.onclick = () => {
    password.type = "text"
    faEye.classList.add('disappear')
    faEyeSlash.classList.add('appear')
}

faEyeSlash.onclick = () => {
    password.type = "password"
    faEye.classList.remove('disappear')
    faEyeSlash.classList.remove('appear')
}

const apiKey = "d89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2"
const logInBtn = document.getElementById('logIn')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')

async function login() {
    try {
        const responce = await fetch("https://restaurantapi.stepacademy.ge/api/auth/login", {
            method: "POST",
            headers: {
                'accept': 'text/plain',
                'X-STEP-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value 
            })
        })

        const body = await responce.text()
    
        if (!responce.ok) {
            let title = "Error"
            let text = "ვერ მოხერხდა აქაუნტზე შესვლა"

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

       const data = JSON.parse(body)
      localStorage.setItem('token', data.data.accessToken)
      sessionStorage.setItem('loginSuccess', 'true') 
      console.log(data);
      

       window.location.href = "index.html"
    } catch (err) {
        console.log(err.message);
    }
}

const form = document.querySelector('form')

form.onsubmit = async (e) => {
    e.preventDefault()
    logInBtn.textContent = 'Loging in'
    logInBtn.disabled = true
    await login()
    logInBtn.textContent = 'Log in'
    logInBtn.disabled = false
}

const toastTitle = document.getElementById('toastTitle')
const toastText = document.getElementById('toastText')
const toast = document.getElementById('toast')

let timer

function showToast(title, text) {
    toastTitle.textContent = title
    toastText.textContent = text

    toast.classList.add('return')
    toast.classList.remove('back')

    clearInterval(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}

const toastClose = document.getElementById('toastClose')

toast.onclick = () => {
    toast.classList.remove('return')
    toast.classList.add('remove')
}



const toastSuccess = document.getElementById('toastSuccess')
const toastIcon = document.getElementById('toastIcon')

function ShowToastSuccessLogin(title, text) {
    toastTitle.textContent = title
    toastText.textContent = text

    toastIcon.classList.add('disappearIcon')
    toastSuccess.classList.add('appearSuccessResetPassword')

    toast.classList.remove('back')
    toast.classList.add('return')

    clearTimeout(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}

if(sessionStorage.getItem('resetPasswordSuccess')){
    sessionStorage.removeItem('resetPasswordSuccess')

    ShowToastSuccessLogin('Password reset successful!', 'You can now login with your new password')
}