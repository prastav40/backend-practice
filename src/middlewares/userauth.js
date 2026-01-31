const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = "backend"; 

const userauth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: "Please Login" });
        }

        const decodedMessage = jwt.verify(token, JWT_SECRET);
        
        const { _id } = decodedMessage;

        const user = await User.findById(_id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User no longer exists" });
        }

        req.user = user; 
        next();
    } catch (err) {
        res.status(401).json({ error: "Authentication failed: " + err.message });
    }
};

module.exports = { userauth };