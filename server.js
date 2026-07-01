const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Local and Cloud hosting safe port connection setup
const PORT = process.env.PORT || 3000;

// Dummy Product and User In-Memory DB Array 
const products = [
    { id: 1, name: "Alpha Gaming Mouse", price: 1200 },
    { id: 2, name: "Mechanical RGB Keyboard", price: 3500 },
    { id: 3, name: "Wireless Noise Cancelling Headphones", price: 4999 },
    { id: 4, name: "UltraWide 24inch Gaming Monitor", price: 12500 }
];
const users = [];

// Base UI Endpoint Routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Products Fetch Endpoint API
app.get('/api/products', (req, res) => {
    res.json(products);
});

// User Registration Database Handling Route
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "Yeh Email pehle se registered hai!" });
    }
    users.push({ name, email, password });
    res.status(201).json({ message: "Registration successful! Ab aap login kar sakte hain." });
});

// User Validation Login Check Endpoint Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Galat Email ya Password!" });
    }
    res.status(200).json({ message: `Welcome back, ${user.name}! Login ho gaya.` });
});

// Trigger Server Listener
app.listen(PORT, () => {
    console.log(`Server is running securely at http://localhost:${PORT}`);
});