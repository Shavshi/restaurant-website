const apiKey = 'd89671b8-c9cc-4cfa-9bd0-87b5ffc2fdd2'

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

const emtyContainer = document.getElementById('container')
const containerForProducts = document.getElementById('containerForProducts')
const template = document.getElementById('basketTemplate')

function renderProducts(items) {
    containerForProducts.innerHTML = ''

    items.forEach(item => {

        const product = item.product || item

        const card = template.content.cloneNode(true)

        card.querySelector('.imgForProduct').src = product.image
        card.querySelector('.nameForProduct').textContent = product.name
        card.querySelector('.descriptionForProduct').textContent = product.description
        card.querySelector('.priceForProduct')



        let count = item.quantity ?? 1
        const number = card.querySelector('.number')
        const btnMinus = card.querySelector('.minus')
        const btnPlus = card.querySelector('.plus')

        const priceEl = card.querySelector('.priceForProduct')
        const unitPrice = product.price
        const price = card.querySelector('.price')

        price.textContent = '$' + unitPrice.toFixed(2) + ' each'

        function updatePrice() {
            number.textContent = count
            priceEl.textContent = "$" + (unitPrice * count).toFixed(2)
        }

        number.textContent = count
        priceEl.textContent = '$' + (number.textContent * unitPrice).toFixed(2)

        btnMinus.onclick = () => {
            if (count <= 1) return
            count--
            updatePrice()
            getQuanity(item.id, count)
        }

        btnPlus.onclick = () => {
            count++
            updatePrice()
            getQuanity(item.id, count)
        }

        const dustBinBtn = card.querySelector('.fa-trash-can')


        dustBinBtn.onclick = () => {
            selectItemId = item.id
            overlay.classList.add('appearOverlay')
        }




        containerForProducts.appendChild(card)
    })

    /// forEach end here

    const overlay = document.querySelector('.overlay')
    const cancelBtn = document.getElementById('cancel')
    const remove = document.getElementById('remove')

    let selectItemId = null

    cancelBtn.onclick = () => {
        overlay.classList.remove('appearOverlay')
    }

    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.classList.remove('appearOverlay')
    }

    remove.onclick = () => {
        deleteProduct(selectItemId)
        overlay.classList.remove('appearOverlay')
        showToast('Removed form cart', 'Product has been remvoed from your cart')
    }

    const itemsLength = document.getElementById('itemsLength')

    itemsLength.textContent = items.length + ' items'

    const subtotalResult = document.querySelector('.subtotalResult')
    const subtotal = items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
    }, 0)

    subtotalResult.textContent = '$' + subtotal.toFixed(2)

    const taxResult = document.querySelector('.TaxResult')
    const tax = items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity * 0.10
    }, 0)

    taxResult.textContent = '$' + tax.toFixed(2)

    const totalResult = document.querySelector('.totalResult')

    totalResult.textContent = '$' + (subtotal + tax).toFixed(2)


    // ტოტალი არ დამისრულებია და უნდა გავაგრზელო ხვალ.
}

async function getQuanity(itemId, quanity) {

    try {
        const responce = await fetch('https://restaurantapi.stepacademy.ge/api/cart/edit-quantity', {
            method: "PUT",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                "itemId": itemId,
                "quantity": quanity
            })
        })

        const body = await responce.json()

        if (!responce.ok) {
            throw new Error("ვერ მივიღეთ quanity");
        }

        getProducts()

    } catch (err) {
        console.log(err.message);
    }
}

const checkOut = document.querySelector('.checkOutContainer')
const itemsShop = document.querySelector('.items')

let cartItems = []
const counterForBasket = document.getElementById('counterForBasket')

async function getProducts() {
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

        const products = body.data.items

        cartItems = products

        counterForBasket.textContent = body.data.totalItems
        counterForBasket.classList.toggle('countBasketAppear', products.length > 0)

        if (products.length > 0) {
            emtyContainer.classList.add('containerDisappear')
            checkOut.classList.remove('disappearCheckout')
            itemsShop.classList.remove('disappearItems')
        } else {
            emtyContainer.classList.remove('containerDisappear')
            checkOut.classList.add('disappearCheckout')
            itemsShop.classList.add('disappearItems')
        }
        console.log(products)

        renderProducts(products)
    } catch (err) {
        console.log(err.message)
    }
}

getProducts()


async function deleteProduct(itemId) {

    try {
        const response = await fetch(`https://restaurantapi.stepacademy.ge/api/cart/remove-from-cart/${itemId}`, {
            method: "DELETE",
            headers: {
                "accept": "text/plain",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            }
        })

        const body = await response.json()

        if (!response.ok) {
            throw new Error("ვერ წაიშალა პროდუქტი");
        }

        getProducts()

    } catch (err) {
        console.log(err.message);
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

async function clearCart() {
    if (cartItems.length === 0) return

    try {
        const results = await Promise.all(
            cartItems.map(item =>
                fetch(`https://restaurantapi.stepacademy.ge/api/cart/remove-from-cart/${item.id}`, {
                    method: "DELETE",
                    headers: {
                        "accept": "text/plain",
                        "X-STEP-KEY": apiKey,
                        "Authorization": `Bearer ${token}`
                    }
                })
            )
        )

        if (results.some(r => !r.ok)) {
            throw new Error("კალათის გასუფთავება ვერ მოხერხდა")
        }

        ShowToastSuccessLogin('Thank you for your purchase!', 'Your order has been placed and is being processed.')
        getProducts()
    } catch (err) {
        console.log(err.message);
    }
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

const checkOutBtn = document.querySelector('.checkOut')

checkOutBtn.onclick = async () => {
    checkOutBtn.textContent = 'Loading'
    checkOutBtn.disabled = true
    await clearCart()
    checkOutBtn.textContent = 'Proceed to Checkout'
    checkOutBtn.disabled = false
}