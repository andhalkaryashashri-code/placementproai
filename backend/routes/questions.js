const express = require("express");
const router = express.Router();

const Question = require("../models/Question");



// ================= ADD QUESTION =================


router.post("/", async(req,res)=>{


try{


const newQuestion = await Question.create({

testId:req.body.testId,

question:req.body.question,

optionA:req.body.optionA,

optionB:req.body.optionB,

optionC:req.body.optionC,

optionD:req.body.optionD,

correctAnswer:req.body.correctAnswer,

marks:req.body.marks || 1,

category:req.body.category || "Technical"

});



res.status(201).json({

success:true,

message:"Question Added Successfully",

question:newQuestion

});


}


catch(error){


console.log("QUESTION ERROR:",error);


res.status(500).json({

success:false,

message:error.message

});


}


});




// =========================
// GET SINGLE QUESTION
// =========================

router.get("/single/:id", async(req,res)=>{

try{


const question = await Question.findById(req.params.id);



res.json({

success:true,

question

});


}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}

});

// ================= GET QUESTIONS =================


router.get("/:testId", async(req,res)=>{


try{


const questions = await Question.find({

testId:req.params.testId

});



res.status(200).json({

success:true,

questions

});


}


catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});
// =========================
// DELETE QUESTION
// =========================

router.delete("/:id", async(req,res)=>{

try{

await Question.findByIdAndDelete(req.params.id);


res.json({

success:true,

message:"Question Deleted Successfully"

});


}

catch(error){

console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}

});

// =========================
// UPDATE QUESTION
// =========================

router.put("/:id", async(req,res)=>{

try{


const updatedQuestion = await Question.findByIdAndUpdate(

req.params.id,

{

question:req.body.question,

optionA:req.body.optionA,

optionB:req.body.optionB,

optionC:req.body.optionC,

optionD:req.body.optionD,

correctAnswer:req.body.correctAnswer,

marks:req.body.marks

},

{
new:true
}

);



res.json({

success:true,

message:"Question Updated Successfully",

question:updatedQuestion

});


}


catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}


});

module.exports = router;