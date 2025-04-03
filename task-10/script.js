// Global Variables
let productsData = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let currentSort = "none";
let searchQuery = "";

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch("products.json");
        productsData = await response.json();
        displayCategories();
        filterAndSortProducts();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Display categories in sidebar
function displayCategories() {
    const categoryList = document.getElementById("category-list");
    if (!categoryList) return;

    const categories = [...new Set(productsData.map(p => p.category))];
    categoryList.innerHTML = `
        <li onclick="setCategory('all')">All</li>
        ${categories.map(cat => `<li onclick="setCategory('${cat}')">${cat}</li>`).join("")}
    `;
}

// Set category filter
function setCategory(category) {
    currentCategory = category;

    // Remove 'active' class from all categories
    document.querySelectorAll("#category-list li").forEach(li => li.classList.remove("active"));

    // Add 'active' class to the selected category
    const selectedCategory = [...document.querySelectorAll("#category-list li")].find(li => li.textContent === category || (category === "all" && li.textContent === "All"));
    if (selectedCategory) 
        selectedCategory.classList.add("active");

    filterAndSortProducts();
}

// Set sorting option
function setSort(option) {
    currentSort = option;
    filterAndSortProducts();
}

function onInputChange(event) {
    searchQuery = event.target.value;
    filterAndSortProducts();
}

// Filter, search, and sort products
function filterAndSortProducts() {
    let filteredProducts = productsData
        .filter(p => (currentCategory === "all" || p.category === currentCategory))
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentSort === "lowToHigh") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === "highToLow") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

// Display product list
function displayProducts(products) {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = products.length === 0
        ? "<p>No products found.</p>"
        : products.map(p => `
            <div class="product">
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p class="price">₹ ${p.price}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `).join("");
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Add product to cart
function addToCart(id) {
    const item = productsData.find(p => p.id === id);
    if (!item) return;

    const cartItem = cart.find(c => c.id === id);
    cartItem ? cartItem.quantity++ : cart.push({ ...item, quantity: 1 });

    saveCart();
}

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Display cart items
function displayCart() {
    const container = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-600 text-lg'>Your cart is empty.</p>";
        totalPriceElement.innerText = "0.00";
        return;
    }

    container.innerHTML = `
        <div class="cart-header">
            <p>Image</p>
            <p>Name</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Delete</p>
        </div>
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <p class="cart-item-title">${item.name}</p>
                    <p class="cart-price">₹ ${item.price}</p>
                    <div class="cart-quantity">
                        <i class="fa-solid fa-minus" onclick="changeQuantity(${item.id}, -1)"></i>
                        <span>${item.quantity}</span>
                        <i class="fa-solid fa-plus" onclick="changeQuantity(${item.id}, -1)"></i>
                    </div>
                    <p class="cart-total-price">₹ ${(item.price * item.quantity).toFixed(2)}</p>
                   <i class="cart-remove fa-solid fa-xmark" onclick="removeFromCart(${item.id})"></i>
                </div>
            `).join("")}
        </div>
    `;

    totalPriceElement.innerText = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

// Modify quantity (increment or decrement)
function changeQuantity(id, change) {
    const cartItem = cart.find(item => item.id === id);
    if (!cartItem) return;

    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== id); // Remove item if quantity <= 0
    }
    saveCart();
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    displayCart();
}

// Initialize app when page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartCount();
    displayCart();
});
