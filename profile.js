let burgerMenu = document.querySelector(".burger")
let navLinks = document.getElementById('nav-links')
const closeBtn = document.createElement('button')

closeBtn.textContent = "x"
closeBtn.classList.add("close-btn")
navLinks.appendChild(closeBtn)


burgerMenu.onclick = () => {
    navLinks.classList.add("active")
}

closeBtn.onclick = () => {
    navLinks.classList.remove('active')
}

let apiKey = "d89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2"

const counterForBasket = document.getElementById('counterForBasket')

async function updateCounter() {
    try {
        const response = await fetch('https://restaurantapi.stepacademy.ge/api/cart', {
            method: "GET",
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error("კალათის წამოღება ვერ მოხერხდა")
        }

        const body = await response.json()

        const count = body.data.totalItems

        counterForBasket.textContent = count
        counterForBasket.classList.toggle('countBasketAppear', count > 0)


    } catch (err) {
        console.log(err.message)
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

    clearInterval(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}

const toastClose = document.getElementById('toastClose')

toast.onclick = () => {
    toast.classList.remove('return')
    toast.classList.add('back')
}

const toastSuccess = document.getElementById('toastSuccess')
const toastIcon = document.getElementById('toastIcon')

function ShowToastSuccessLogin(title, text) {
    toastTitle.textContent = title
    toastText.textContent = text

    toastIcon.classList.add('disappearIcon')
    toastSuccess.classList.add('appearSuccessLogin')

    toast.classList.remove('back')
    toast.classList.add('return')

    clearTimeout(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
}

const registerButtons = document.querySelector('.register-buttons')
const mobileButtons = document.querySelector('.mobile-buttons')
const faUser = document.getElementById('faUser')
const token = localStorage.getItem('token')


const userName = document.getElementById('userName')

if (token) {
    registerButtons.classList.add('hideBtns')
    mobileButtons.classList.add('hideBtns')
    faUser.classList.add('userAppear')
    updateCounter()
    getUsersInfo()
    getUserProfile()

    const payload = JSON.parse(atob(token.split('.')[1]))
    userName.textContent = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'][0]
} else {
    registerButtons.classList.remove('hideBtns')
    mobileButtons.classList.remove('hideBtns')
    faUser.classList.remove('userAppear')

}

const dropdown = document.querySelector('.dropdown')

faUser.onclick = () => {
    dropdown.classList.toggle('show')
}

const logout = document.getElementById('logout')

logout.onclick = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    location.reload()
}

const firstNameInput = document.getElementById('firstNameInput')
const lastNameInput = document.getElementById('lastNameInput')
const emailInput = document.getElementById('emailInput')

async function getUsersInfo() {

    try {
        const responce = await fetch('https://restaurantapi.stepacademy.ge/api/users/me', {
            method: "GET",
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            }
        })

        const body = await responce.json()


        if (!responce.ok) {
            throw new Error("ვერ მივიღეთ მომხმარებლსი მონაცემები");
        }

        const user = body.data

        firstNameInput.value = user.firstName
        lastNameInput.value = user.lastName
        emailInput.value = user.email

    } catch (err) {
        console.log(err.message);
    }
}

const phoneNumberInput = document.getElementById('phoneNumberInput')
const addressInput = document.getElementById('addressInput')
const ageInput = document.getElementById('ageInput')
const pictureInput = document.getElementById('pictureInput')
const saveChanges = document.getElementById('saveChanges')

async function getUserProfile() {
    try {
        const response = await fetch('https://restaurantapi.stepacademy.ge/api/users/profile', {
            method: "GET",
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            }
        })

        const body = await response.text()

        if (!response.ok) {
            let title = "Error"
            let message = "ვერ შევცვალეთ მონაცემები"
            try {
                const data = JSON.parse(text)
                title = data.title || title
                message = data.detail || message
            } catch {
                message = body || message
            }
            showToast(title, message)
            return
        }

        const parsed = JSON.parse(body)
        const user = parsed.data ?? parsed

        phoneNumberInput.value = user.phoneNumber ?? ""
        addressInput.value = user.address ?? ""
        ageInput.value = user.age ?? ""
        pictureInput.value = user.picture ?? ""

    } catch (err) {
        console.log(err.message);
    }
}

async function editUserProfile() {
    try {
        const response = await fetch('https://restaurantapi.stepacademy.ge/api/users/edit', {
            method: "PUT",
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                phoneNumber: phoneNumberInput.value.trim(),
                picture: pictureInput.value.trim(),
                address: addressInput.value.trim(),
                age: Number(ageInput.value.trim())
            })
        })

        const text = await response.text()

        if (!response.ok) {
            let title = "Error"
            let message = "ვერ შევცვალეთ მონაცემები"
            try {
                const data = JSON.parse(text)
                title = data.title || title
                message = data.detail || message
            } catch {
                message = text || message
            }
            showToast(title, message)
            return
        }

        ShowToastSuccessLogin("Success", "მონაცემები წარმატებით შეიცვალა")
    } catch (err) {
        console.log(err.message);
    }
}

saveChanges.onclick = async () => {
    saveChanges.textContent = 'Saving...'
    saveChanges.disabled = true
    if (await editUserProfile()) {
        await getUserProfile()
    }
    saveChanges.textContent = 'Save Changes'
    saveChanges.disabled = false
}

const personaInfo = document.getElementById('personaInfo')
const accountSetting = document.getElementById('accountSetting')
const changePassword = document.getElementById('changePassword')
const first = document.querySelector('.first')
const second = document.querySelector('.second')
const third = document.querySelector('.third')

accountSetting.onclick = () => {
    first.classList.add('disappearFirst')
    second.classList.add('appearSecond')
    third.classList.remove('appearThird')
}

personaInfo.onclick = () => {
    first.classList.remove('disappearFirst')
    second.classList.remove('appearSecond')
    third.classList.remove('appearThird')
}

changePassword.onclick = () => {
    first.classList.add('disappearFirst')
    third.classList.add('appearThird')
    second.classList.remove('appearSecond')
}

const overlay = document.querySelector('.overlay')
const cancelBtn = document.getElementById('cancel')
const remove = document.getElementById('remove')
const DeleteMyAccount = document.getElementById('DeleteMyAccount')

DeleteMyAccount.onclick = () => {
    overlay.classList.add('appearOverlay')
}

cancelBtn.onclick = () => {
    overlay.classList.remove('appearOverlay')
}

overlay.onclick = (e) => {
    if (e.target === overlay) overlay.classList.remove('appearOverlay')
}

async function deleteAccount() {
    try {
        const responce = await fetch('https://restaurantapi.stepacademy.ge/api/users/delete', {
            method: "DELETE",
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            }
        })

        const text = await responce.text()

        if (!responce.ok) {
            let title = "Error"
            let message = "ექაუნთის წაშლა ვერ მოხერხდა"
            try {
                const data = JSON.parse(text)
                title = data.title || title
                message = data.detail || message
            } catch {
                message = text || message
            }
            showToast(title, message)
            return
        }

        localStorage.removeItem('token')
        showToast('Account deleted', 'Your account has been permanently deleted')

        setTimeout(() => {
            window.location.href = "signUp.html"
        }, 1500)

    } catch (err) {
        console.log(err.message);
    }
}

remove.onclick = async () => {
    overlay.classList.remove('appearOverlay')
    await deleteAccount()
}

const faEyeFirst = document.getElementById('faEyeFirst')
const faEyeSlashFirst = document.getElementById('faEyeSlashFirst')
const currentPasswordInput = document.getElementById('currentPasswordInput')

faEyeFirst.onclick = () => {
    currentPasswordInput.type = 'text'
    faEyeFirst.classList.add('disappearEye')
    faEyeSlashFirst.classList.add('appearEyeSlash')
}

faEyeSlashFirst.onclick = () => {
    currentPasswordInput.type = 'password'
    faEyeFirst.classList.remove('disappearEye')
    faEyeSlashFirst.classList.remove('appearEyeSlash')
}

const newPasswordInput = document.getElementById('newPasswordInput')
const faEyeSecond = document.getElementById('faEyeSecond')
const faEyeSlashSecond = document.getElementById('faEyeSlashSecond')

faEyeSecond.onclick = () => {
    newPasswordInput.type = 'text'
    faEyeSecond.classList.add('disappearEye')
    faEyeSlashSecond.classList.add('appearEyeSlash')
}

faEyeSlashSecond.onclick = () => {
    newPasswordInput.type = 'password'
    faEyeSecond.classList.remove('disappearEye')
    faEyeSlashSecond.classList.remove('appearEyeSlash')
}

const confirmNewPasssword = document.getElementById('confirmNewPasssword')
const passwordError = document.getElementById('passwordErrors')
const passwprdErorrs = document.querySelector('.errors')

function isvaildPassword() {
    const newPassword = newPasswordInput.value
    const confirmPassword = confirmNewPasssword.value

    if (newPassword.length < 8) {
        passwordError.textContent = "New password must be at least 8 characters"
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/(?=.*[A-Z])/.test(newPassword)) {
        passwordError.textContent = "The new password must contain at least one uppercase letter."
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/(?=.*[a-z])/.test(newPassword)) {
        passwordError.textContent = "The new password must contain at least one lowercase letter."
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/(?=.*\d)/.test(newPassword)) {
        passwordError.textContent = "The new password must contain at least one digit."
        passwprdErorrs.classList.add("appearPasswordErrors")
        return false
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
        passwordError.textContent = "The new password must contain at least one special character"
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
confirmNewPasssword.oninput = isvaildPassword

async function changeUserPassword() {
    try {
        const response = await fetch('https://restaurantapi.stepacademy.ge/api/users/change-password', {
            method: "PUT",
            headers: {
                'accept': 'text/plain',
                'X-STEP-KEY': apiKey,
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                oldPassword: currentPasswordInput.value.trim(),
                newPassword: newPasswordInput.value.trim(),
                confirmPassword: confirmNewPasssword.value.trim()
            })
        })
        const text = await response.text()

        if (!response.ok) {
            let title = "Error"
            let message = "ექაუნთის წაშლა ვერ მოხერხდა"
            try {
                const data = JSON.parse(text)
                title = data.title || title
                message = data.detail || message
            } catch {
                message = text || message
            }
            showToast(title, message)
            return
        }

        ShowToastSuccessLogin('Password changed', "Your password has been changed successfully")
    } catch (err) {
        console.log(err.message);
    }
}

const form = document.querySelector('form')
const updatePasswordBtn = document.getElementById('updatePasswordBtn')

form.onsubmit = async (e) => {
    e.preventDefault()
    if(!isvaildPassword()) return
    updatePasswordBtn.textContent = 'Updating'
    updatePasswordBtn.disabled = true
    await changeUserPassword()
    updatePasswordBtn.textContent = 'Update Password'
    updatePasswordBtn.disabled = false    
}