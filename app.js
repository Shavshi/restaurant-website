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
let container = document.getElementById('dishes-container')

async function getProducts() {
    try {
        const responce = await fetch("https://restaurantapi.stepacademy.ge/api/products?Take=6&Page=1", {
            method: "GET",
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey
            }
        });

        if (!responce.ok) {
            throw new Error("ვერ მოხერხდა პროდუქტების წამოღება")
        }

        const body = await responce.json()



        renderProducts(body.data.products)

    } catch (err) {
        console.log(err.message);
    }
}

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


async function getProductsForBasket(productId, quantity = 1) {

    try {
        const response = await fetch('https://restaurantapi.stepacademy.ge/api/cart/add-to-cart', {
            method: "POST",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                "productId": productId,
                "quantity": quantity
            })
        })

        if (!response.ok) {
            throw new Error("ვერ დაემატა კალათაში");
        }

        const body = await response.json()



        await updateCounter()
        return true

    } catch (err) {
        console.log(err.message)
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

function renderProducts(products) {
    container.innerHTML = ''

    products.forEach(product => {
        let div = document.createElement("div")
        let image = document.createElement("img")
        image.src = product.image

        let name = document.createElement('b')
        name.textContent = product.name

        let description = document.createElement('h6')
        description.textContent = product.description

        let rate = document.createElement('h5')
        rate.textContent = "★ " + product.rate

        let price = document.createElement('p')
        price.textContent = "$" + product.price

        let btn = document.createElement('button')
        btn.textContent = "Add to Cart"

        btn.onclick = async (e) => {
            e.stopPropagation()

            if (!token) {
                showToast('Authentication Required', 'You need to be logged in to perform this action.')
            } else {
                btn.textContent = "Loading..."
                btn.disabled = true
                console.log(btn.disabled);
                await getProductsForBasket(product.id)

                ShowToastSuccessLogin('Added to cart', 'Product has been added to your cart')
                btn.textContent = 'Add to Cart'
                btn.disabled = false
            }
        }

        div.onclick = () => {
            window.location.href = `popular.html?id=${product.id}`
        }

        div.appendChild(image)
        div.appendChild(name)
        div.appendChild(description)
        div.appendChild(rate)
        div.appendChild(price)
        div.appendChild(btn)
        div.classList.add('dish-card')

        container.appendChild(div)
    });
}

getProducts()

const registerButtons = document.querySelector('.register-buttons')
const mobileButtons = document.querySelector('.mobile-buttons')
const faUser = document.getElementById('faUser')
const token = localStorage.getItem('token')
const toastSuccess = document.getElementById('toastSuccess')
const toastIcon = document.getElementById('toastIcon')

if (sessionStorage.getItem('loginSuccess')) {
    sessionStorage.removeItem('loginSuccess')

    ShowToastSuccessLogin('Welcome back!', 'You have successfully logged in')
}

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

const userName = document.getElementById('userName')

if (token) {
    registerButtons.classList.add('hideBtns')
    mobileButtons.classList.add('hideBtns')
    faUser.classList.add('userAppear')
    updateCounter()

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

const cartLink = document.querySelector('a[href="basket.html"]')

cartLink.onclick = (e) => {
    if (!token) {
        e.preventDefault()
        window.location.href = 'logIn.html'
    }
}