import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/Auth.css";


function Login() {


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







const handleSubmit=async(e)=>{


e.preventDefault();



try{


const res = await API.post(

"/auth/login",

formData

);





localStorage.setItem(

"token",

res.data.token

);






localStorage.setItem(

"user",

JSON.stringify(res.data.user)

);






if(res.data.user.role==="student"){


navigate("/student/dashboard");


}

else{


alert("Please use student account for this login");


}



}



catch(err){


alert(

err.response?.data?.message ||

"Login Failed"

);


}



};









return(


<div className="auth-page">


<div className="auth-card">





<div className="auth-logo">

🚀 PlacementProAI

</div>






<h1>

Welcome Back

</h1>




<h2>

Student Login

</h2>






<form

onSubmit={handleSubmit}

autoComplete="off"

>






<input

type="email"

name="email"

placeholder="Enter Email Address"

value={formData.email}

onChange={handleChange}

autoComplete="off"

required

/>








<input

type="password"

name="password"

placeholder="Enter Password"

value={formData.password}

onChange={handleChange}

autoComplete="new-password"

required

/>









<button type="submit">

Login

</button>






</form>








<p className="auth-bottom">


Don't have an account?


<Link to="/register">

 Register

</Link>


</p>






</div>


</div>


);


}


export default Login;