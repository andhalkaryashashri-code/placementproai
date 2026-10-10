import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import "../../styles/TeacherDashboard.css";

import { Link } from "react-router-dom";
function TeacherDashboard(){


const navigate = useNavigate();




const teacher = {

name:"Teacher",

email:"teacher@placementproai.com",

subject:"Information Technology"

};







return(


<>


<Navbar/>





<div className="teacher-dashboard">






<h1>

Welcome {teacher.name} 👨‍🏫

</h1>





<p className="subtitle">

Manage students, tests and placement preparation 🚀

</p>









<div className="profile-card">


<h2>

👤 Teacher Profile

</h2>



<p>

<b>Name:</b> {teacher.name}

</p>



<p>

<b>Email:</b> {teacher.email}

</p>



<p>

<b>Department:</b> {teacher.subject}

</p>



</div>









<h2>

⚡ Quick Actions

</h2>






<Link
  to="/teacher/prediction"
  className="teacher-ai-prediction-button"
>
  <span className="teacher-ai-icon">🧠</span>
  <span>AI Performance Prediction</span>
  <span className="teacher-ai-arrow">→</span>
</Link>



<div className="quick-actions">






<div

className="action-card"

onClick={()=>navigate("/teacher/add-test")}

>


<h3>

➕ Create Test

</h3>



<p>

Create aptitude and technical tests for students.

</p>



</div>









<div

className="action-card"

onClick={()=>navigate("/teacher/manage-questions")}

>


<h3>

📚 Manage Questions

</h3>



<p>

Add questions and manage test results.

</p>



</div>









<div

className="action-card"

onClick={()=>navigate("/teacher/students")}

>


<h3>

👨‍🎓 View Students

</h3>



<p>

Check student profiles and progress.

</p>



</div>







</div>








</div>





</>


)


}



export default TeacherDashboard;