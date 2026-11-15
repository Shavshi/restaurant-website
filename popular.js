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


const registerButtons = document.querySelector('.register-buttons')
const mobileButtons = document.querySelector('.mobile-buttons')
const faUser = document.getElementById('faUser')
const token = localStorage.getItem('token')
const userName = document.getElementById('userName')


if (token) {
    registerButtons.classList.add('hideBtns')
    mobileButtons.classList.add('hideBtns')
    faUser.classList.add('userAppear')
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


let apiKey = "d89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2"
const params = new URLSearchParams(window.location.search)
let id = params.get('id')

async function getProductsById(id) {

    try {
        const response = await fetch(`https://restaurantapi.stepacademy.ge/api/products/${encodeURIComponent(id)}`, {
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey
            }
        })

        const body = await response.json()


        if (!response.ok) {
            throw new Error("ვერ მოხერხდა აიდის მიღება");
        }

        return body.data

    } catch (err) {
        console.log(err.message);

    }
}

async function shownProduct() {
    const product = await getProductsById(id)
    if (!product) return

    console.log(product);

    document.getElementById('imgForProduct').src = product.image

    document.getElementById('nameForProduct').textContent = product.name

    document.getElementById('rateForProduct').textContent = '(' + product.rate + ' ' + "rating" + ')'

    document.getElementById('stars').textContent = renderStar(product.rate)

    document.getElementById('priceForProduct').textContent = '$' + product.price.toFixed(2)

    document.getElementById('descriptionForProduct').textContent = product.description

    document.getElementById('btnForAddToCart').textContent = 'Add to Cart'

    document.getElementById('methodForProduct').textContent = product.method



    const ul = document.getElementById('ingredientsForProduct')

    ul.innerHTML = ''

    product.ingredients.forEach(item => {
        const li = document.createElement('li')
        li.textContent = item
        ul.appendChild(li)
    });
}

const btnForAddToCart = document.getElementById('btnForAddToCart')

btnForAddToCart.onclick = async () => {
    if (!token) {
        showToast('Authentication Required', 'You need to be logged in to perform this action.')
        return
    }

    btnForAddToCart.textContent = "Loading..."
    btnForAddToCart.disabled = true
    const ok = await getProductsForBasket(id, count)
    btnForAddToCart.textContent = 'Add to Cart'
    btnForAddToCart.disabled = false


    if (ok) {
        ShowToastSuccessLogin('Added to cart', 'Product has been added to your cart')
    } else {
        showToast('Error', 'Could not add to cart')
    }
}

function renderStar(rate) {
    const full = Math.floor(rate)
    let starts = '★'.repeat(full) + '☆'.repeat(5 - full)
    return starts
}

function countProduct() {
    document.getElementById('minus').textContent = "-"
    document.getElementById('plus').textContent = "+"
    document.getElementById('number').textContent = 1
}

shownProduct()

const btnMinus = document.getElementById('btnMinus')
const btnPlus = document.getElementById('btnPlus')
const number = document.getElementById('number')
let count = 1

number.textContent = count

btnMinus.onclick = () => {
    if (count <= 1) {
        return
    }
    count--
    number.textContent = count
}

btnPlus.onclick = () => {
    count++
    number.textContent = count
}

let allProducts = []

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

        allProducts = body.data.products

        renderProducts()

    } catch (err) {
        console.log(err.message);
    }
}

const container = document.getElementById('container')

function renderProducts() {
    container.innerHTML = ''

    const visibleProducts = allProducts
        .filter(p => String(p.id) !== String(id))
        .slice(0, 3)


    visibleProducts.forEach(product => {
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
                return
            }

            btn.textContent = "Loading..."
            btn.disabled = true
            const ok = await getProductsForBasket(product.id)
            btn.textContent = 'Add to Cart'
            btn.disabled = false

            if (ok) {
                ShowToastSuccessLogin('Added to cart', 'Product has been added to your cart')
            } else {
                showToast('Error', 'Could not add to cart')
            }
        }

        div.onclick = async () => {
            id = product.id
            await shownProduct()
            renderProducts()
        }

        div.appendChild(image)
        div.appendChild(name)
        div.appendChild(description)
        div.appendChild(rate)
        div.appendChild(price)
        div.appendChild(btn)
        div.classList.add('dish-card')

        container.appendChild(div)
    })

}

getProducts()

const toastTitle = document.getElementById('toastTitle')
const toastText = document.getElementById('toastText')
const toast = document.getElementById('toast')

let timer

function showToast(title, text) {
    toastTitle.textContent = title
    toastText.textContent = text

    toastIcon.classList.remove('disappearIcon')
    toastSuccess.classList.remove('appearSuccessLogin')
    toast.classList.add('return')
    toast.classList.remove('back')

    clearInterval(timer)
    timer = setTimeout(() => {
        toast.classList.remove('return')
        toast.classList.add('back')
    }, 5000);
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



const toastClose = document.getElementById('toastClose')

toast.onclick = () => {
    toast.classList.remove('return')
    toast.classList.add('back')
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

if (token) {
    updateCounter()
}

const cartLink = document.querySelector('a[href="basket.html"]')

cartLink.onclick = (e) => {
    if (!token) {
        e.preventDefault()
        window.location.href = 'logIn.html'
    }
}