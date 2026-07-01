let cart = [];

const productsListContainer = document.getElementById("products-list");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const cartTotalPriceElement = document.getElementById("cart-total-price");
const checkoutBtn = document.getElementById("checkout-btn");

// Global variable backend products ko store karne ke liye
let localProductsList = [];

// 1. Backend API se Products fetch karna
async function loadProductsFromBackend() {
    try {
        const response = await fetch('/api/products');
        localProductsList = await response.json();
        displayProducts(localProductsList);
    } catch (error) {
        console.error("Products load karne mein dikkat aayi:", error);
    }
}

function displayProducts(products) {
    productsListContainer.innerHTML = "";
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">₹${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsListContainer.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = localProductsList.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalCount;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalPriceElement.innerText = "0";
        return;
    }
    
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");
        cartItemDiv.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <small>₹${item.price} x ${item.quantity}</small>
            </div>
            <span>₹${itemTotal}</span>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });
    
    cartTotalPriceElement.innerText = totalPrice;
}

// 2. Backend API par Order data bhejna (Checkout)
checkoutBtn.addEventListener("click", async () => {
    if (cart.length === 0) {
        alert("Aapka cart khali hai!");
        return;
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems: cart, totalAmount: totalAmount })
        });

        const result = await response.json();

        if (result.success) {
            alert(`🎉 ${result.message}\nOrder ID: ${result.orderId}`);
            cart = [];
            updateCartUI();
        } else {
            alert("Order fail ho gaya!");
        }
    } catch (error) {
        console.error("Checkout error:", error);
    }
});

// App shuru hote hi backend se data mangwana
loadProductsFromBackend();