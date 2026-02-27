const mongoose=require('mongoose');

const mongodb=async()=>{
    await mongoose.connect(process.env.mongodbconnect)
}

module.exports=mongodb;

