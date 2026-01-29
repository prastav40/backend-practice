const express = require('express');
const router = express.Router();
const ConnectionRequest = require('../models/connectionrequeststatus');
const { userauth } = require('../middlewares/userauth');

router.post("/request/send/:status/:toUserId", userauth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
       if(fromUserId==toUserId){
         return res.json({message:"You cannot send connection request to yourself"})
       }
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { senderid: fromUserId, receiverid: toUserId },
                { senderid: toUserId, receiverid: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Connection Request already exists!" });
        }

        const newConnectionRequest = new ConnectionRequest({
            senderid: fromUserId,
            receiverid: toUserId,
            status: status
        });

        const data = await newConnectionRequest.save();
        
        res.json({
            message: "Request Sent Successfully",
            data: data
        });

    } catch (err) {
        res.status(400).json({
            message: "Error: " + err.message
        });
    }
});

module.exports = router;