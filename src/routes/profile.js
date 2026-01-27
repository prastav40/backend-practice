const express=require('express');
const { userauth } = require('../middlewares/userauth');
const profilerouter=express.Router();
const { usereditvalidate } = require('../utils/usereditvalidate');

profilerouter.get("/profile/view",userauth,async(req,res)=>{
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

profilerouter.patch("/profile/edit",userauth,async(req,res)=>{
     try{
        if(!usereditvalidate(req,res)){
            return res.status(400).json({error:"Invalid updates!"});
        }
        const user=req.user;
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        const updates=req.body;
        Object.keys(updates).forEach((update)=>{
            user[update]=updates[update];
        });
        await user.save();
        res.send(user);
     }catch(err){
        res.status(400).json({error:"Could not update profile"});
     }
});


module.exports=profilerouter;