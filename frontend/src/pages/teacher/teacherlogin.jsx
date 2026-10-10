import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";


function TeacherLogin(){


const navigate = useNavigate();



const [formData,setFormData] = useState({

email:"",
password:""

});






const handleChange=(e)=>{


setFormData({

...formData,

[e.target.name]:e.target.value

});


};







const handleSubmit=(e)=>{


e.preventDefault();




if(

formData.email==="teacher" &&

formData.password==="teacher123"

){



const teacher = {

name:"Teacher",

email:"teacher",

role:"teacher"

};





localStorage.setItem(

"user",

JSON.stringify(teacher)

);





navigate("/teacher/dashboard");



}

else{


alert("Invalid Teacher Username or Password");


}



};







return(


<div className="auth-page">


<div className="auth-card">





<div className="auth-logo">

🚀 PlacementProAI

</div>






<h1>

Welcome Teacher

</h1>




<h2>

Teacher Login

</h2>








<form 

onSubmit={handleSubmit}

autoComplete="off"

>






<input

type="text"

name="email"

placeholder="Username"

value={formData.email}

onChange={handleChange}

autoComplete="off"

required

/>








<input

type="password"

name="password"

placeholder="Password"

value={formData.password}

onChange={handleChange}

autoComplete="new-password"

required

/>









<button type="submit">

Login

</button>






</form>







</div>


</div>


);


}



export default TeacherLogin;