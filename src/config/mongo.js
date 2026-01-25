const mongoose=require('mongoose');

const mongodb=async()=>{
    await mongoose.connect("mongodb+srv://deokarprastav2004_db_user:hRrLbqtbwHHFXJvw@cluster0.ypecdrs.mongodb.net/?appName=Cluster0")
}

module.exports=mongodb;