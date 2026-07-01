let cart = [];

// App initialization
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

// Fetch products from full-stack backend server
async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            productList.innerHTML += `
                <div class="card">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price}</p>
                    <button class="add-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
                </div>
            `;
        });
    } catch (err) {
        console.error("Products load karne mein dikkat aayi:", err);
    }
}

// Section logic switcher
function showSection(sectionId) {
    document.getElementById('products-section').style.display = sectionId === 'products-section' ? 'block' : 'none';
    document.getElementById('cart-section').style.display = sectionId === 'cart-section' ? 'block' : 'none';
    if(sectionId === 'cart-section') renderCart();
}

// Add to Cart
function addToCart(id, name, price) {
    const item = cart.find(p => p.id === id);
    if(item) {
        item.qty++;
    } else {
        cart.push({id, name, price, qty: 1});
    }
    updateCartCount();
    alert(`${name} cart mein add ho gaya!`);
}

function updateCartCount() {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cart-count').innerText = totalQty;
}

// Render Cart view
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    
    if(cart.length === 0) {
        cartItems.innerHTML = '<p>Aapka cart khali hai.</p>';
        cartTotal.innerText = '0';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name} (x${item.qty})</span>
                <span>₹${item.price * item.qty}</span>
            </div>
        `;
    });
    cartTotal.innerText = total;
}

function checkout() {
    if(cart.length === 0) return alert("Pehle cart mein kuch add toh karo!");
    alert("Order successful! Thank you for shopping at AlphaShop.");
    cart = [];
    updateCartCount();
    showSection('products-section');
}

// Modal Toggle utilities
function openAuthModal() { document.getElementById('auth-modal').style.display = 'flex'; }
function closeAuthModal() { document.getElementById('auth-modal').style.display = 'none'; }
function toggleAuthForm(showRegister) {
    document.getElementById('login-form-box').style.display = showRegister ? 'none' : 'block';
    document.getElementById('register-form-box').style.display = showRegister ? 'block' : 'none';
}

// User Actions Handlers
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    alert(data.message);
    if(res.ok) toggleAuthForm(false);
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    alert(data.message);
    if(res.ok) closeAuthModal();
});