import {useEffect,useState} from "react";
import API from "../api/axios";


function Aptitude(){


const [questions,setQuestions]=useState([]);

const [answers,setAnswers]=useState({});

const [score,setScore]=useState(null);

const [submitted,setSubmitted]=useState(false);



const [testInfo,setTestInfo]=useState({

subject:"Aptitude",
date:new Date().toLocaleDateString()

});





useEffect(()=>{


getQuestions();


},[]);






const getQuestions=async()=>{


try{


const res=await API.get("/questions");


setQuestions(res.data);


}


catch(error){


console.log(error);


}


};








const selectAnswer=(id,answer)=>{


setAnswers({

...answers,

[id]:answer

});


};










const submitTest=async()=>{


let total=0;



questions.forEach((q)=>{


if(
answers[q._id]===q.answer
){


total++;


}


});




setScore(total);

setSubmitted(true);




const user=JSON.parse(
localStorage.getItem("user")
);





try{


await API.post(

"/performance/save",

{

userId:user._id,

studentName:user.name,

subject:testInfo.subject,

testDate:testInfo.date,

totalQuestions:questions.length,

score:total,

percentage:
((total/questions.length)*100).toFixed(2)


}


);



}

catch(error){


console.log(error);


}



};







return(


<div className="page">



<h1>
📝 {testInfo.subject} Test
</h1>



<p>
Date : {testInfo.date}
</p>





{

questions.length===0 ?


<h3>
Loading Questions...
</h3>



:



questions.map((q,index)=>(



<div

className="question-card"

key={q._id}

>


<h3>

{index+1}. {q.question}

</h3>






{

q.options.map((option)=>(


<label

key={option}

style={{
display:"block",
margin:"10px"
}}

>



<input

type="radio"

name={q._id}

disabled={submitted}

onChange={()=>selectAnswer(q._id,option)}

/>


{option}



</label>


))


}




</div>



))


}






<button

onClick={submitTest}

disabled={submitted}

>


{

submitted ?

"Submitted"

:

"Submit Test"

}



</button>







{

score!==null &&


<div>


<h2>

Your Score : {score}/{questions.length}

</h2>


<h3>

Percentage :
{
((score/questions.length)*100).toFixed(2)
}%

</h3>


</div>


}





</div>


)



}


export default Aptitude;