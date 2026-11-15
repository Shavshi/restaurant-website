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

const btnBurgerForFilter = document.getElementById('btnBurgerForFilter')
const containerFilter = document.querySelector('.containerFilter')
const closeFilterBtn = document.createElement('button')
closeFilterBtn.textContent = "x"
closeFilterBtn.classList.add('close-btn-filter')
containerFilter.appendChild(closeFilterBtn)


btnBurgerForFilter.onclick = () => {
   containerFilter.classList.add('activeFilter')
}

closeFilterBtn.onclick = () => {
    containerFilter.classList.remove('activeFilter')
}

const userName = document.getElementById('userName')
const registerButtons = document.querySelector('.register-buttons')
const mobileButtons = document.querySelector('.mobile-buttons')
const faUser = document.getElementById('faUser')
const token = localStorage.getItem('token')

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

        if (!response.ok) throw new Error("კალათის წამოღება ვერ მოხერხდა")

        const body = await response.json()
        const count = body.data.totalItems

        counterForBasket.textContent = count
        counterForBasket.classList.toggle('countBasketAppear', count > 0)
    } catch (error) {
        console.log(error)
    }
}

const categoriesDiv = document.querySelector('.categories')

async function getCategories() {

    try {
        const responce = await fetch('https://restaurantapi.stepacademy.ge/api/categories', {
            method: "GET",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json",
                "X-STEP-KEY": apiKey,
                "Authorization": `Bearer ${token}`
            }
        })

        const body = await responce.json()

        if (!responce.ok) {
            throw new Error("ვერ მივიღეთ კატეგორიები");
        }

        const categories = body.data

        renderCategories(categories)
    } catch (err) {
        console.log(err.message);
    }
}


function renderCategories(categories) {
    categoriesDiv.innerHTML = ''

    const title = document.createElement('div')
    title.classList.add('categoryP')
    title.textContent = 'Categories'
    categoriesDiv.appendChild(title)

    categories.forEach(category => {
        const div = document.createElement('div')
        div.classList.add('div')

        const checkBox = document.createElement('input')
        checkBox.type = 'radio'
        checkBox.name = 'category'
        checkBox.value = category.id
        checkBox.classList.add('checkBox')


        const span = document.createElement('span')
        span.textContent = category.name

        div.append(checkBox, span)
        categoriesDiv.appendChild(div)
    });
}

getCategories()

const spicinessRange = document.getElementById('spicinessRange')
const spicinessLevel = document.getElementById('spicinessLevel')

spicinessRange.oninput = () => {
    spicinessLevel.textContent = `Level: ${spicinessRange.value}`
}

const ratingRange = document.getElementById('ratingRange')
const ratingValue = document.getElementById('ratingValue')

ratingValue.textContent = Number(ratingValue.textContent).toFixed(1) + '+'

ratingRange.oninput = () => {
    ratingValue.textContent = Number(ratingRange.value).toFixed(1) + '+'
}

const minPriceRange = document.getElementById('minPriceRange')
const minPriceValue = document.getElementById('minPriceValue')

minPriceRange.oninput = () => {
    minPriceValue.textContent = `$ ${minPriceRange.value}+`
}

const maxPriceRange = document.getElementById('maxPriceRange')
const maxPriceValue = document.getElementById('maxPriceValue')

maxPriceValue.textContent = "$" + " 99+"

maxPriceRange.oninput = () => {
    maxPriceValue.textContent = `$ ${maxPriceRange.value}+`
}

const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn')

clearAllFiltersBtn.onclick = () => {
    minPriceRange.value = 0
    maxPriceRange.value = 99
    spicinessRange.value = 0
    ratingRange.value = 0
    currentPage = 1
    spicinessLevel.textContent = `Level: not selected`
    ratingValue.textContent =  Number(ratingRange.value).toFixed(1) + '+'
    minPriceValue.textContent = `$ ${minPriceRange.value}+`
    maxPriceValue.textContent = "$" + " 99+"
    
    const checked = document.querySelector('input[name="category"]:checked')
    if (checked) checked.checked = false

    searchInput.value = ''

    getFiltedForProducts()
}

async function getFiltedForProducts() {


    try {
        const checked = document.querySelector('input[name="category"]:checked')

        const params = new URLSearchParams({
           Take: 10,
           MinPrice: minPriceRange.value,
           MaxPrice: maxPriceRange.value,
           Page: currentPage
        })

        if(spicinessRange.value > 0 ) params.append('spiciness', spicinessRange.value)
        if(ratingRange.value > 0) params.append('rate', ratingRange.value)
        if(checked) params.append('CategoryId', checked.value)

        

        const responce = await fetch(`https://restaurantapi.stepacademy.ge/api/products/filter?${params}`, {
            method: "GET",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json",
                "X-STEP-KEY": apiKey,
            }
        })

        const body = await responce.json()

        if (!responce.ok) {
            throw new Error("ვერ მოხერხდა გაფილტვრა პროდუქტების");
        }

        allProducts = body.data.products

        renderProducts(body.data.products)
        showPagination(body.data.hasMore)

    } catch (err) {
        console.log(err.message);
    }
}

[spicinessRange, ratingRange, minPriceRange, maxPriceRange].forEach(input => {
    input.addEventListener('change', () => {
        currentPage = 1
        getFiltedForProducts()
    })
})

categoriesDiv.addEventListener('change', () => {
    currentPage = 1
    getFiltedForProducts()
})

let allProducts = []

async function getPrduct() {
    try {
        const responce = await fetch(`https://restaurantapi.stepacademy.ge/api/products?Take=10&Page=${currentPage}`, {
            method: "GET",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json",
                "X-STEP-KEY": apiKey,
            }
        })

        const body = await responce.json()

        if (!responce.ok) {
            throw new Error("ვერ მივიღეთ პრიდუქტები");
        }

        allProducts = body.data.products

        renderProducts(body.data.products)
        showPagination(body.data.hasMore)
    } catch (err) {
        console.log(err.message);
    }
}

const searchInput = document.getElementById('searchInput')
const noPopularDishesYet = document.querySelector('.noPopularDishesYet')

searchInput.addEventListener('keyup', () => {
    const result = allProducts.filter(product => {
        return product.name.toLowerCase().includes(searchInput.value.toLowerCase())
    })

    forBtns.classList.toggle('disappearFotBtns', result.length === 0)
    noPopularDishesYet.classList.toggle('noPopularDishesYetAppear', result.length === 0)

    renderProducts(result)
})

let currentPage = 1
const forBtns = document.querySelector('.forBtns')

function showPagination(hasMore) {
    forBtns.innerHTML = ''

    if (currentPage > 1) {
        let previous = document.createElement('button')
        previous.textContent = '<' + 'Previous'

        previous.onclick = () => {
            currentPage--
            getFiltedForProducts()
        }

        forBtns.appendChild(previous)
    }

    if (hasMore) {
        let nextBtn = document.createElement('button')
        nextBtn.textContent = 'Next' + '>'

        nextBtn.onclick = () => {
            currentPage++
            getFiltedForProducts()
        }

        forBtns.appendChild(nextBtn)
    }


}

const container = document.getElementById('container')
const showingProducts = document.getElementById('showingProducts')


function renderProducts(products) {
    container.innerHTML = ''

    products.forEach(product => {
        let div = document.createElement('div')
        div.classList.add('div')

        let img = document.createElement('img')

        img.src = product.image

        let name = document.createElement('b')

        name.textContent = product.name

        let description = document.createElement('p')

        description.textContent = product.description

        let rate = document.createElement('h5')

        rate.textContent = '★' + product.rate.toFixed(1)

        let price = document.createElement('h2')

        price.textContent = '$' + product.price.toFixed(2)

        let btn = document.createElement('button')

        btn.textContent = 'Add to Cart'

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

        div.append(img, name, description, rate, price, btn)
        container.appendChild(div)
    })

    showingProducts.textContent = "Showing " + products.length + " products"

     forBtns.classList.toggle('disappearFotBtns', products.length === 0)
     noPopularDishesYet.classList.toggle('noPopularDishesYetAppear', products.length === 0)
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

getFiltedForProducts()

const cartLink = document.querySelector('a[href="basket.html"]')

cartLink.onclick = (e) => {
    if (!token) {
        e.preventDefault()
        window.location.href = 'logIn.html'
    }
}