let apiKey = 'd89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2'

const inputVerify = document.getElementById('inputVerify')
const verifyBtn = document.getElementById('verifyBtn')
const emailText = document.getElementById('emailText')
const userEmail = sessionStorage.getItem("verifyEmail")

emailText.textContent = "We sent a 6-digit code to " + userEmail

inputVerify.maxLength = 6

function inputvalue() {

    if (inputVerify.value.length !== 6) {
        verifyBtn.classList.add('btnDisable')
    } else {
        verifyBtn.classList.remove('btnDisable')
    }

    verifyBtn.disabled = inputVerify.value.length !== 6
}

inputVerify.oninput = () => {
    inputvalue()
}

async function getEmailCode() {

    try {
        const responce = await fetch("https://restaurantapi.stepacademy.ge/api/auth/verify-email", {
            method: "PUT",
            headers: {
                'accept': 'text/plain',
                'X-STEP-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                code: inputVerify.value
            })
        })

        const body = await responce.text()

        if (!responce.ok) {
            let title = "Error"
            let text = "არასწორი კოდია"

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

        window.location.href = "logIn.html"
    } catch (err) {
        console.log(err.message);
    }

}

const form = document.querySelector('form')

form.onsubmit = async (e) => {
    e.preventDefault()
    verifyBtn.textContent = 'verifying'
    verifyBtn.disabled = true
    await getEmailCode()
    verifyBtn.textContent = 'verify'
    verifyBtn.disabled = false
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

const toastIcon = document.getElementById('toastIcon')
const toastSuccesIcon = document.getElementById('toastSuccess')
const toastContent = document.getElementById('toastContent')

function ShowToastSuccess(title, text) {
    toastTitle.textContent = title
    toastText.textContent = text

    toastIcon.classList.add('disappearIcon')
    toastSuccesIcon.classList.add('appearCheckSuccess')
    toastText.classList.add('size')
    toastContent.classList.add('gapForsuccess')

    toast.classList.remove('back')
    toast.classList.add('return')

    clearTimeout(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}

if(sessionStorage.getItem('signUpSuccess')){
    sessionStorage.removeItem('signUpSuccess')

    ShowToastSuccess('Registration successful!', 'verification code sent to your email')
}

inputvalue()

async function resendCode() {
    try {
        const response = await fetch(`https://restaurantapi.stepacademy.ge/api/auth/resend-email-verification/${encodeURIComponent(userEmail)}`, {
            method: "POST",
            headers: {
                'accept': 'text/plain',
                'X-STEP-KEY': apiKey
            },
        })

        const body = await response.text()

        if (!response.ok) {
            let title = "Error"
            let text = "კოდის გაგზავნა ვერ მოხერხდა"

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

        ShowToastSuccess("Code sent!", "A new verification code has been sent to your email")
    } catch (err) {
        console.log(err.message);
    }
}

const resendBtn = document.getElementById('ResendCode')
const resendInBtn = document.getElementById('ResendIn')
const seconds = document.getElementById('seconds')
let resendTimer

resendBtn.onclick = () => {
    resendCode()

    resendBtn.classList.add('disappearResendCode')
    resendInBtn.classList.add('appearResendIn')
    let second = 60
    seconds.textContent = second
    resendBtn.disabled = true

    clearInterval(resendTimer)
    resendTimer = setInterval(() => {
        second--
        seconds.textContent = second

        if (second <= 0) {
            clearInterval(resendTimer)
            resendBtn.disabled = false
            seconds.textContent = ''
            resendBtn.classList.remove('disappearResendCode')
            resendInBtn.classList.remove('appearResendIn')
        }
    }, 1000);
}