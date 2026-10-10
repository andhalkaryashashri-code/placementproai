const express = require("express");

const router = express.Router();


const {

generateResume,

mockInterview,

generateInterviewQuestion,

codingAssistant,

teacherChat


} = require("../controllers/aiController");
// AI TEACHER CHAT BOT

router.post(

"/chat",

teacherChat

);

// AI RESUME

router.post(

"/resume",

generateResume

);




// AI MOCK INTERVIEW

router.post(

"/mock-interview",

mockInterview

);




// AI RANDOM QUESTION GENERATOR

router.post(

"/interview-question",

generateInterviewQuestion

);




// AI CODING ASSISTANT

router.post(

"/coding",

codingAssistant

);



module.exports = router;