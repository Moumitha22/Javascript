// Global Variables
let productsData = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch("products.json");
        productsData = await response.json();
        displayProducts();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Display product list
function displayProducts() {
    const container = document.getElementById("products");
    if (!container || productsData.length === 0)
        return;

    container.innerHTML = productsData.map(p => `
        <div class="product">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="price">₹ ${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join("");
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

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
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
                        <button onclick="changeQuantity(${item.id}, -1)">➖</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">➕</button>
                    </div>
                    <p class="cart-total-price">₹ ${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="cart-remove" onclick="removeFromCart(${item.id})">❌</button>
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
