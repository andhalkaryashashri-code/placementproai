import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";

import "../../styles/ViewQuestions.css";


function ViewQuestions(){


const {testId} = useParams();
const navigate = useNavigate();
const [questions,setQuestions] = useState([]);



useEffect(()=>{

loadQuestions();

},[]);




const loadQuestions = async()=>{

try{

const res = await API.get(`/questions/${testId}`);

console.log("QUESTIONS:",res.data);


setQuestions(res.data.questions || []);


}

catch(error){

console.log(error);

}

};

const deleteQuestion = async(id)=>{

try{

await API.delete(`/questions/${id}`);

alert("Question Deleted Successfully");

loadQuestions();

}

catch(error){

console.log(error);

alert("Delete Failed");

}

};



return(

<>

<Navbar/>


<div className="view-question-container">


<h1>📋 Test Questions</h1>



{
questions.length === 0 ?


<h3 className="no-question">
No Questions Added
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



<p className="option">
A) {q.optionA}
</p>


<p className="option">
B) {q.optionB}
</p>


<p className="option">
C) {q.optionC}
</p>


<p className="option">
D) {q.optionD}
</p>





<p className="correct-answer">

✅ Correct Answer : {q.correctAnswer}

</p>




<p className="marks">

🏷 Marks : {q.marks}

</p>
<div className="question-actions">

<button
onClick={()=>deleteQuestion(q._id)}
>
🗑 Delete
</button>


<button
onClick={()=>navigate(`/teacher/edit-question/${q._id}`)}
>
✏️ Edit
</button>


</div>



<hr/>


</div>



))

}




</div>



</>

)


}



export default ViewQuestions;