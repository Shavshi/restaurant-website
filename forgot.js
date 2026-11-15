let apiKey = "d89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2"
const emailInput = document.getElementById('emailInput')
const sendBtn = document.getElementById('btn')
const form = document.querySelector('form')

form.onsubmit = async (e) => {
     e.preventDefault()     
    sendBtn.textContent = 'Sending...'
    sendBtn.disabled = true
    await forgotPassword()
    sendBtn.textContent = 'Send Reset Link'
    sendBtn.disabled = false
}

async function forgotPassword() {
    try {
        const response = await fetch(`https://restaurantapi.stepacademy.ge/api/auth/forgot-password/${encodeURIComponent(emailInput.value)}`, {
            method: "POST",
            headers: {
                'accept': 'text/plain',
                'X-STEP-KEY': apiKey,
            },
        })

        const body = await response.text()

        if (!response.ok) {
            let title = "Error"
            let text = "ვერ მოხერხდა ემაილის მიღება"


            try {
                const data = JSON.parse(body)
                title = data.title || title
                text = data.detail || text
            } catch {
                text = body || text
            }

            showToast(title, text)
            return false
        }

        let token
        
        try {
            token = JSON.parse(body).data
        } catch {
            token = body
        }


        if (!token) {
            showToast("Error", "ტოკენი ვერ მივიღე")
            return false
        }

        localStorage.setItem('data', token)
        window.location.href = 'reset.html'
        return true
    } catch (err) {
        console.log(err.message);
        showToast("Error", "სერვერთან კავშირი ვერ მოხერხდა")
        return false
    }
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

    clearTimeout(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}
