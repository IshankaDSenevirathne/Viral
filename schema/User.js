const mongoose = require("mongoose");
import validator from "validator"

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate:[validator.isEmail,"Please enter valid email address"]

    },
    password:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})

export default mongoose.models?.Users|| mongoose.model("Users",userSchema)