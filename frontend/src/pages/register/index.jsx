import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/Auth.css";


function Register() {


const navigate = useNavigate();



const [formData,setFormData] = useState({

name:"",
email:"",
password:"",
confirmPassword:"",
college:"",
branch:"",
year:"",
phone:""

});





const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};







const handleSubmit=async(e)=>{

e.preventDefault();



if(formData.password !== formData.confirmPassword){

alert("Passwords do not match");

return;

}



try{


await API.post(

"/auth/register",

{

name:formData.name,

email:formData.email,

password:formData.password,

college:formData.college,

branch:formData.branch,

year:formData.year,

phone:formData.phone,

role:"student"

}

);



alert("Registration Successful");


navigate("/login");



}



catch(error){


alert(

error.response?.data?.message ||

"Registration Failed"

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
Create Account
</h1>




<h2>
Student Registration
</h2>





<p>
Start your placement preparation journey
</p>








<form onSubmit={handleSubmit} autoComplete="off">





<input

type="text"

name="name"

placeholder="Full Name"

value={formData.name}

onChange={handleChange}

required

/>





<input

type="email"

name="email"

placeholder="Email Address"

value={formData.email}

onChange={handleChange}

required

/>






<input

type="text"

name="college"

placeholder="College Name"

value={formData.college}

onChange={handleChange}

/>







<input

type="text"

name="branch"

placeholder="Branch (IT/CS)"

value={formData.branch}

onChange={handleChange}

/>







<input

type="text"

name="year"

placeholder="Current Year"

value={formData.year}

onChange={handleChange}

/>







<input

type="tel"

name="phone"

placeholder="Phone Number"

value={formData.phone}

onChange={handleChange}

/>







<input

type="password"

name="password"

placeholder="Create Password"

value={formData.password}

onChange={handleChange}

required

/>








<input

type="password"

name="confirmPassword"

placeholder="Confirm Password"

value={formData.confirmPassword}

onChange={handleChange}

required

/>







<button type="submit">

Create Account

</button>







</form>







<p className="auth-bottom">

Already have an account?


<Link to="/login">

 Login

</Link>


</p>






</div>


</div>


);


}


export default Register;