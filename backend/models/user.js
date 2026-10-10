const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    branch:{
        type:String,
        default:"Information Technology"
    },

    year:{
        type:String,
        default:"Third Year"
    },

    college:{
        type:String,
        default:"Trinity Academy of Engineering"
    },

    role:{
        type:String,
        enum:[
            "student",
            "teacher",
            "admin"
        ],
        default:"student"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "User",
    userSchema
);