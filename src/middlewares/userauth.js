const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Use environment variables for production
const JWT_SECRET = "backend"; 

const userauth = async (req, res, next) => {
    try {
        // Use optional chaining to prevent crashes if req.cookies is missing
        const token = req.cookies?.token;
        console.log("Token from cookies:", token);
        if (!token) {
            return res.status(401).json({ error: "Please Login" });
        }

        // Verify token
        const decodedMessage = jwt.verify(token, JWT_SECRET);
        console.log("Decoded JWT message:", decodedMessage);
        
        // Use the specific key you used during sign-in (usually _id or id)
        const { _id } = decodedMessage;

        const user = await User.findById(_id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User no longer exists" });
        }

        req.user = user; 
        next();
    } catch (err) {
        // Distinguish between expired and invalid tokens if needed
        res.status(401).json({ error: "Authentication failed: " + err.message });
    }
};

module.exports = { userauth };