const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = "backend"; 

const userauth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: "Please Login" });
        }

        // 1. Verify token
        const decodedMessage = jwt.verify(token, JWT_SECRET);
        const { _id } = decodedMessage;

        // 2. Fetch user and exclude password
        // Renamed to 'user' for consistency with the route handler
        const user = await User.findById(_id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 3. Attach user to request object
        req.user = user; 
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

module.exports = { userauth };