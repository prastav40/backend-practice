const express=require('express');
const { userauth } = require('../middlewares/userauth');
const profilerouter=express.Router();

profilerouter.get("/profile",userauth,async(req,res)=>{
    try {
        const user = req.user; // You defined it as 'user'
        console.log("Authenticated user:", user);
        // ERROR HERE: You are checking 'userData', but it doesn't exist!
        if (!user) { 
            return res.status(404).json({ error: "User not found" });
        }

        res.send(user); 
    } catch (err) {
        // This catch block will run because 'userData' is undefined/not declared
        res.status(400).json({ error: "Invalid Token" }); 
    }
});

module.exports=profilerouter;