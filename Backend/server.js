// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let users = []; // Array to store registered users (username, password, role)
let sessions = {}; // Simple in-memory session management (username: true)
let slots = [
    { time: '10:00 AM', booked: false, name: '', createdBy: null },
    { time: '11:00 AM', booked: false, name: '', createdBy: null },
    { time: '12:00 PM', booked: false, name: '', createdBy: null },
    { time: '1:00 PM', booked: false, name: '', createdBy: null },
    { time: '2:00 PM', booked: false, name: '', createdBy: null },
    { time: '3:00 PM', booked: false, name: '', createdBy: null },
    { time: '4:00 PM', booked: false, name: '', createdBy: null },
    { time: '5:00 PM', booked: false, name: '', createdBy: null }
];

app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    if (users.find(user => user.username === username)) {
        return res.status(409).json({ error: 'Username already exists' });
    }
    users.push({ username, password, role });
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    sessions[username] = true; // Simple session "creation"
    res.json({ message: 'Login successful', role: user.role, token: username }); // Sending username as a very basic "token"
});

// Middleware to check if user is logged in (very basic)
const isLoggedIn = (req, res, next) => {
    const token = req.headers['authorization']; // Assuming token is sent in the Authorization header
    if (token && sessions[token]) {
        req.user = { username: token, role: users.find(u => u.username === token)?.role };
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

app.get('/slots', isLoggedIn, (req, res) => {
    res.json(slots);
});

app.post('/book', isLoggedIn, (req, res) => {
    const { time } = req.body;
    const { user } = req; // Get user object from middleware
    if (!time) {
        return res.status(400).json({ error: 'Time is required' });
    }
    const slot = slots.find(s => s.time === time && !s.booked);
    if (!slot) {
        return res.status(404).json({ error: 'Time slot not found or already booked' });
    }
    slot.booked = true;
    slot.name = user.username; // Use logged-in username for booking
    res.json({ success: true, message: `Slot at ${time} booked by ${user.username}` });
});

app.post('/cancel', isLoggedIn, (req, res) => {
    const { time } = req.body;
    const { user } = req; // Get user object from middleware
    if (!time) {
        return res.status(400).json({ error: 'Time is required' });
    }
    const slot = slots.find(s => s.time === time && s.name === user.username); // Only allow cancelling own booking
    if (!slot) {
        return res.status(404).json({ error: 'Time slot not found or not booked by you' });
    }
    slot.booked = false;
    slot.name = '';
    res.json({ success: true, message: `Slot at ${time} cancelled by ${user.username}` });
});

// New endpoint for mentors to add slots
app.post('/slots/add', isLoggedIn, (req, res) => {
    const { time } = req.body;
    const { user } = req;
    if (user.role !== 'mentor') {
        return res.status(403).json({ error: 'Only mentors can add slots' });
    }
    if (!time) {
        return res.status(400).json({ error: 'Time is required to add a slot' });
    }
    if (slots.find(s => s.time === time)) {
        return res.status(409).json({ error: 'Slot with this time already exists' });
    }
    slots.push({ time, booked: false, name: '', createdBy: user.username });
    res.status(201).json({ message: `Slot at ${time} added successfully` });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});