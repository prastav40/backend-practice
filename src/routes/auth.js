const express=require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authrouter=express.Router();
const JWT_SECRET="backend"; 


authrouter.post("/signup",async(req,res)=>{
     try {
            const { password, firstname, lastname, email } = req.body;
    
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
})

authrouter.post("/login",async(req,res)=>{
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
})

authrouter.post("/logout",(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
})

module.exports=authrouter;