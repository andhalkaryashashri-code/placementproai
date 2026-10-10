require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});



// ================= AI RESUME GENERATOR =================

exports.generateResume = async (req, res) => {

  try {

    const { details } = req.body;


    if (!details) {

      return res.status(400).json({

        success:false,

        message:"Resume details are required."

      });

    }



    const completion = await groq.chat.completions.create({

      model:"llama-3.3-70b-versatile",

      temperature:0.5,

      max_tokens:2000,

      messages:[

        {

          role:"system",

          content:
          `
You are an expert ATS Resume Builder.

Create complete professional resumes.

Rules:
- Never stop early.
- Never add fake information.
- Use only candidate provided details.
- Keep resume recruiter friendly.
          `

        },


        {

          role:"user",

          content:
          `
Create a complete ATS-friendly resume using ONLY the information below.

${details}


IMPORTANT:

- Include all available sections.
- Do not stop after education section.
- Do not create fake projects.
- Do not create fake internship.
- Do not add extra skills.
- Do not add extra certifications.
- Improve grammar and formatting only.
- Give only resume content.
- No explanation.
          `

        }

      ]

    });



    return res.status(200).json({

      success:true,

      resume:
      completion.choices[0].message.content

    });


  }


  catch(error){

    console.error("========== AI RESUME ERROR ==========");

    console.error(error);


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }


};









// ================= AI MOCK INTERVIEW =================

exports.mockInterview = async(req,res)=>{


try{


const {role}=req.body;



const completion = await groq.chat.completions.create({


model:"llama-3.3-70b-versatile",


temperature:0.8,


max_tokens:200,



messages:[


{

role:"system",

content:
"You are an expert technical interviewer. Ask only one interview question."

},



{

role:"user",

content:
`Start a mock interview for ${role}. Ask one random technical interview question.`

}



]


});




return res.status(200).json({


success:true,


question:

completion.choices[0].message.content



});



}


catch(error){


console.error("========== AI MOCK INTERVIEW ERROR ==========");

console.error(error);



return res.status(500).json({


success:false,


message:error.message


});


}


};










// ================= AI INTERVIEW QUESTION GENERATOR =================


exports.generateInterviewQuestion = async(req,res)=>{


try{


const {role}=req.body;



if(!role){

return res.status(400).json({

success:false,

message:"Role is required"

});

}



const completion = await groq.chat.completions.create({


model:"llama-3.3-70b-versatile",


temperature:0.9,


max_tokens:200,



messages:[


{


role:"system",


content:

`
You are a professional technical interviewer.

Generate only one interview question.

Do not give explanation.
Do not give answer.
`

},



{


role:"user",


content:

`
Generate a random interview question for ${role} position.

The question should be suitable for a fresher software developer.
`

}


]


});





return res.status(200).json({


success:true,


question:

completion.choices[0].message.content


});



}



catch(error){


console.error("========== AI QUESTION ERROR ==========");

console.error(error);



return res.status(500).json({


success:false,


message:error.message


});


}


};











// ================= AI CODING ASSISTANT =================


exports.codingAssistant = async(req,res)=>{


try{


const {topic}=req.body;



const completion = await groq.chat.completions.create({


model:"llama-3.3-70b-versatile",


messages:[


{

role:"system",

content:
"You are an expert coding mentor."

},



{

role:"user",

content:
`Generate one coding interview question on ${topic} with a detailed solution.`

}


]


});




return res.status(200).json({


success:true,


problem:

completion.choices[0].message.content


});



}



catch(error){


console.error("========== AI CODING ERROR ==========");

console.error(error);



return res.status(500).json({


success:false,


message:error.message


});


}


};
// ================= AI TEACHER CHAT BOT =================

exports.teacherChat = async(req,res)=>{


try{


const {question}=req.body;



if(!question){


return res.status(400).json({

success:false,

message:"Question is required"

});


}





const completion = await groq.chat.completions.create({


model:"llama-3.3-70b-versatile",


temperature:0.7,


max_tokens:500,



messages:[


{


role:"system",


content:

`
You are an AI Teacher Assistant for PlacementProAI.

Help teachers with:
- Placement preparation
- Interview questions
- Aptitude questions
- Technical questions
- Student guidance
- Company preparation

Give clear and useful answers.
`


},





{


role:"user",


content:question


}



]


});







return res.status(200).json({


success:true,


answer:

completion.choices[0].message.content



});





}



catch(error){



console.error("========== AI TEACHER CHAT ERROR ==========");

console.error(error);



return res.status(500).json({


success:false,

message:error.message


});


}


};