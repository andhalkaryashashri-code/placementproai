import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "../../styles/AddTest.css";


function EditQuestion(){


const { id } = useParams();


const [question,setQuestion] = useState({

question:"",
optionA:"",
optionB:"",
optionC:"",
optionD:"",
correctAnswer:"",
marks:1

});





useEffect(()=>{

loadQuestion();

},[]);





const loadQuestion = async()=>{

try{


const res = await API.get(`/questions/single/${id}`);


setQuestion(res.data.question);


}


catch(error){

console.log(error);

}

};







const handleChange=(e)=>{

setQuestion({

...question,

[e.target.name]:e.target.value

});

};







const updateQuestion = async(e)=>{

e.preventDefault();


try{


await API.put(`/questions/${id}`,question);


alert("Question Updated Successfully");



}


catch(error){

console.log(error);


alert("Update Failed");


}


};







return(

<>

<Navbar/>


<div className="add-test">


<h1>
✏️ Edit Question
</h1>



<form onSubmit={updateQuestion}>


<input

name="question"

value={question.question}

onChange={handleChange}

/>



<input

name="optionA"

value={question.optionA}

onChange={handleChange}

/>



<input

name="optionB"

value={question.optionB}

onChange={handleChange}

/>



<input

name="optionC"

value={question.optionC}

onChange={handleChange}

/>



<input

name="optionD"

value={question.optionD}

onChange={handleChange}

/>



<select

name="correctAnswer"

value={question.correctAnswer}

onChange={handleChange}

>


<option value="A">
Option A
</option>


<option value="B">
Option B
</option>


<option value="C">
Option C
</option>


<option value="D">
Option D
</option>


</select>




<button type="submit">

Update Question

</button>



</form>


</div>


</>

)

}


export default EditQuestion;