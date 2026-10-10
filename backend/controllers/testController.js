const Test = require("../models/Test");



// CREATE TEST

exports.createTest = async(req,res)=>{

    try{


        const test = await Test.create(req.body);



        res.json({

            success:true,

            message:"Test Created Successfully",

            test

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};







// GET ALL TESTS

exports.getTests = async(req,res)=>{

    try{


        const tests = await Test.find();



        res.json({

            success:true,

            tests

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};







// GET TODAY TEST

exports.getTodayTest = async(req,res)=>{

    try{


        const today = new Date()
        .toISOString()
        .split("T")[0];



        console.log(
            "TODAY DATE:",
            today
        );



        const test = await Test.findOne({

            date: today

        });



        console.log(
            "FOUND TEST:",
            test
        );



        res.json({

            success:true,

            test

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};