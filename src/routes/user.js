const express = require("express");
const router = express.Router();
const { userauth } = require("../middlewares/userauth");
const ConnectionRequest = require("../models/connectionrequeststatus");
const User=require("../models/user");

router.get("/user/requests/pending", userauth, async (req, res) => {
    try {
        const userId = req.user._id;

        const pendingrequest = await ConnectionRequest.find({
            receiverid: userId,
            status: "interested"
        })
            .populate('senderid', 'firstname lastname');

        res.status(200).json({
            message: "Pending requests fetched successfully",
            data: pendingrequest
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

router.get("/user/requests/accepted", userauth, async (req, res) => {
    try {
        const user = req.user._id;
        const accepted = await ConnectionRequest.find({
            receiverid: user,
            status: "accepted"
        }).populate('senderid', 'firstname lastname');

        if (accepted) {
            res.status(200).json({
                data: accepted.map((result) => result.senderid),
            });
        }

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

router.get("/feed", userauth, async (req, res) => {
    try {
        const userId = req.user._id;
        const limit=parseInt(req.query.limit) || 10;
        const skip=parseInt((limit-1)*(req.query.skip)) || 0;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ senderid: userId }, { receiverid: userId }]
        }).select("senderid receiverid");

        const hideUsersFromFeed = new Set();
        
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.senderid.toString());
            hideUsersFromFeed.add(req.receiverid.toString());
        });

        const users = await User.find({
            _id: { 
                $nin: Array.from(hideUsersFromFeed),
                $ne: userId                          
            }
        }).skip(skip).limit(limit)
        .select("_id firstname lastname photoUrl about skills") 
      
        res.json(users);

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


module.exports = router;