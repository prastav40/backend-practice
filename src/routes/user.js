const express = require("express");
const router = express.Router();
const { userauth } = require("../middlewares/userauth");
const ConnectionRequest = require("../models/connectionrequeststatus");

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
     try{
         const user = req.user._id;
         const accepted=await ConnectionRequest.find({
            receiverid: user, 
            status: "accepted"
         })
         .populate('senderid', 'firstname lastname');
         
         if(accepted){
            res.status(200).json({
                data: accepted.map((result) => result.senderid),
            });
         }

     }catch(err){
        res.status(400).send("ERROR: " + err.message);
     }
})


module.exports = router;