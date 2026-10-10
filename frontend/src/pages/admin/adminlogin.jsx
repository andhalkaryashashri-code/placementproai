import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";


function AdminLogin(){


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

formData.email === "admin@placementproai.com" &&

formData.password === "admin123"

){



const adminUser = {


name:"Admin",

email:"admin@placementproai.com",

role:"admin"


};






localStorage.setItem(

"token",

"admin-token"

);







localStorage.setItem(

"user",

JSON.stringify(adminUser)

);







navigate("/admin");





}



else{


alert(

"Invalid Admin Email or Password"

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

Admin Portal

</h1>





<h2>

Admin Login

</h2>









<form

onSubmit={handleSubmit}

autoComplete="off"

>









<input


type="email"


name="email"


placeholder="Admin Email"


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



export default AdminLogin;