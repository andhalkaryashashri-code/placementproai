const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema(

{

testId:{
    type:String,
    required:true
},


question:{
    type:String,
    required:true,
    trim:true
},


optionA:{
    type:String,
    required:true
},


optionB:{
    type:String,
    required:true
},


optionC:{
    type:String,
    required:true
},


optionD:{
    type:String,
    required:true
},


correctAnswer:{
    type:String,
    required:true
},


marks:{
    type:Number,
    default:1
},


category:{
    type:String,
    default:"Technical"
}


},

{
timestamps:true
}


);


module.exports = mongoose.model("Question",questionSchema);