const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware - Frontend files ko serve karne aur JSON data padhne ke liye
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 1. Database Mock (Products ki list backend par)
const products = [
    { id: 1, name: "Wireless Mouse", price: 799, category: "Tech" },
    { id: 2, name: "Mechanical Keyboard", price: 2499, category: "Tech" },
    { id: 3, name: "Gaming Headphones", price: 1999, category: "Audio" },
    { id: 4, name: "Smart Watch", price: 3499, category: "Wearable" }
];

// Orders ko store karne ke liye ek array (Database ki tarah)
let orders = [];

// 2. API Route - Saare products frontend ko bhejne ke liye
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 3. API Route - Order receive karne ke liye (Checkout API)
app.post('/api/checkout', (req, res) => {
    const { cartItems, totalAmount } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Cart khali hai!" });
    }

    // Naya order object banana
    const newOrder = {
        orderId: 'ORD' + Date.now(),
        items: cartItems,
        total: totalAmount,
        date: new Date()
    };

    // Orders array mein save karna
    orders.push(newOrder);
    console.log("New Order Received:", newOrder); // Terminal par dikhega

    res.json({ success: true, message: "Order processed successfully!", orderId: newOrder.orderId });
});

// Server ko start karna
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});