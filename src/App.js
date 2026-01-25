const express = require('express');
const app = express();
const mongodb = require('./config/mongo');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userauth } = require('./middlewares/userauth');

const JWT_SECRET = "backend"; // Keep this in environment variables in production

app.use(express.json());
app.use(cookieParser());

// --- SIGNUP ROUTE ---
app.post("/signup", async (req, res) => {
    try {
        const { password, firstname, lastname, email } = req.body;

        // Generate hash using await correctly
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ROUTE ---
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ error: "User Not Found or password missing" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login Successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PROFILE ROUTE ---
app.get("/profile", userauth,async (req, res) => {
    try {
        const user=req.user;
        
        
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        res.send(userData);
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
});

// --- DATABASE CONNECTION ---
mongodb().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Failed to connect to the database', err);
});