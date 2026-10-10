const Question = require("../models/Question");



// ADD QUESTION

exports.addQuestion = async (req,res)=>{

    try{


        const question = await Question.create(req.body);



        res.json({

            success:true,

            message:"Question Added Successfully",

            question

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};






// GET ALL QUESTIONS

exports.getQuestions = async(req,res)=>{

    try{


        const questions = await Question.find({
            category:"Aptitude"
        });



        res.json({

            success:true,

            questions

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};







// GET QUESTIONS BY TEST ID

exports.getQuestionsByTest = async(req,res)=>{

    try{


        const questions = await Question.find({

            testId:req.params.testId

        });



        res.json({

            success:true,

            questions

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};