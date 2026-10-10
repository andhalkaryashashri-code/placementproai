import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/layout/Navbar";
import "../../styles/AddTest.css";


function AddQuestion(){


const { testId } = useParams();


console.log("TEST ID:", testId);



const [question,setQuestion] = useState({

question:"",
options:["","","",""],
answer:"",
category:"Technical"

});





const handleOptionChange=(index,value)=>{


const updatedOptions=[...question.options];


updatedOptions[index]=value;



setQuestion({

...question,

options:updatedOptions

});


};






const handleChange=(e)=>{


setQuestion({

...question,

[e.target.name]:e.target.value

});


};








const addQuestion = async(e)=>{


e.preventDefault();



if(!testId){

alert("Test ID missing");

return;

}





try{


const response = await API.post(

"/questions",

{


testId:testId,


question:question.question,


optionA:question.options[0],


optionB:question.options[1],


optionC:question.options[2],


optionD:question.options[3],



correctAnswer:question.answer,


marks:1,


category:question.category


}

);





console.log(response.data);



alert("✅ Question Added Successfully");





setQuestion({

question:"",

options:["","","",""],

answer:"",

category:"Technical"

});



}



catch(error){


console.log(error.response?.data || error);



alert("❌ Failed to Add Question");


}



};









return(

<>


<Navbar/>



<div className="add-test">



<h1>
➕ Add Question
</h1>





<form onSubmit={addQuestion}>






<input

name="question"

placeholder="Enter Question"

value={question.question}

onChange={handleChange}

required

/>







{

question.options.map((op,index)=>(


<input


key={index}


type="text"


placeholder={`Option ${index+1}`}


value={op}


onChange={(e)=>

handleOptionChange(index,e.target.value)

}


required


/>



))


}









<select


name="answer"


value={question.answer}


onChange={handleChange}


required



>


<option value="">
Select Correct Answer
</option>


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









<select


name="category"


value={question.category}


onChange={handleChange}



>


<option value="Technical">
Technical
</option>


<option value="Aptitude">
Aptitude
</option>


<option value="Coding">
Coding
</option>



</select>








<button type="submit">

Add Question

</button>






</form>





</div>



</>

)


}



export default AddQuestion;