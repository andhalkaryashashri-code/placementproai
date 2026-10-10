import { useNavigate } from "react-router-dom";
import { UserRound, LogIn, UserPlus, Sparkles } from "lucide-react";
import "../../styles/Auth.css";


function Student(){

const navigate = useNavigate();


return(

<div className="student-page">


<div className="student-card">


<div className="student-icon">
<UserRound size={55}/>
</div>



<div className="auth-logo">
🚀 PlacementProAI
</div>



<h1>
Student Portal
</h1>



<p>
Prepare for aptitude tests, coding rounds, interviews and
build your placement skills with AI-powered learning.
</p>





<div className="student-buttons">


<button

className="primary-btn"

onClick={()=>navigate("/login")}

>

<LogIn size={18}/>

Login

</button>







<button

className="secondary-btn"

onClick={()=>navigate("/register")}

>

<UserPlus size={18}/>

Register

</button>




</div>





<div className="student-feature">

<Sparkles size={20}/>

AI Powered Placement Preparation

</div>



</div>


</div>


)

}


export default Student;