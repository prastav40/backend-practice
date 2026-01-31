const express = require('express');
const router = express.Router();
const ConnectionRequest = require('../models/connectionrequeststatus');
const User = require('../models/user');
const { userauth } = require('../middlewares/userauth');
const mongoose = require('mongoose');

router.post("/request/send/:status/:userwhoreceive", userauth, async (req, res) => {
    try {
        const receiverid = req.user._id;
        const senderid = req.params.userwhoreceive;
        const status = req.params.status;

        const allowedStatuses = ["interested", "ignored"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        if (senderid.toString() === receiverid.toString()) {
            return res.status(400).json({ message: "You cannot send connection request to yourself" });
        }

        const toUser = await User.findById(senderid);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { senderid: senderid, receiverid: receiverid },
                { senderid: receiverid, receiverid: senderid }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Connection Request already exists!" });
        }

        const newConnectionRequest = new ConnectionRequest({
            senderid: senderid,
            receiverid: receiverid,
            status: status
        });

        const data = await newConnectionRequest.save();

        res.json({
            message: "Request Sent Successfully",
            data: data
        });

    } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
    }
});

router.post("/request/review/:status/:objectidofconnectionrequeststatus", userauth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const requestId = req.params.objectidofconnectionrequeststatus;
        const status = req.params.status;

        const allowedStatuses = ["accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const objectId = new mongoose.Types.ObjectId(requestId);

        const connectionRequest = await ConnectionRequest.findOne({
            _id: objectId,
            receiverid: loggedInUserId,
            status: "interested"
        });

        if (!connectionRequest) {
            console.log("RESULT: Request NOT found. Check if loggedInUser is actually the receiver.");
            return res.status(404).json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        console.log("RESULT: Success");
        res.json({ message: "Connection request " + status, data: data });

    } catch (err) {
        console.log("ERROR:", err.message);
        res.status(400).json({ message: "Error: " + err.message });
    }
});

module.exports = router;