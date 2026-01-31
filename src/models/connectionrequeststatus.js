const mongoose = require('mongoose');

const connectionrequeststatus = new mongoose.Schema({
   senderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
   },
   receiverid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },
   status: {
      type: String,
      required: true,
      enum: {
         values: ["ignore", "interested", "accepted", "rejected"],
         message: "Status can only be intersted, accepted,ignore or rejected"
      }
   }
},
   { timestamps: true }
);
connectionrequeststatus.index({ senderid: 1, receiverid: 1 }, { unique: true });


module.exports = mongoose.model('connectionrequeststatus', connectionrequeststatus);