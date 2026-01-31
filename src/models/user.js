const mongoose = require('mongoose');
const validator = require('validator');

const userSchema= new mongoose.Schema({
    
    firstname: {
        type: String
    },
   lastname:{
        type: String,   
   } ,
    email:{ 
        type: String,
        validate(value){
         if(!validator.isEmail(value)){
            throw new Error("Invalid Email Format");
         }
        }
    },
    password:{
        type: String,
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
    }
});

module.exports = mongoose.model('Users', userSchema);
    