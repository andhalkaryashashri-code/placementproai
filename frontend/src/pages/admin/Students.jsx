import Navbar from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/AdminDashboard.css";


function Students(){


const [students,setStudents] = useState([]);



useEffect(()=>{

loadStudents();

},[]);





const loadStudents = async()=>{


try{


const res = await API.get("/users/students");


if(res.data.success){

setStudents(res.data.students);

}


}


catch(error){


console.log(
"Students Load Error",
error
);


}



};






return(

<>


<Navbar/>




<div className="admin-dashboard">



<h1>
👨‍🎓 Student Management
</h1>




<div className="admin-grid">



{

students.length === 0 ?


<h3>
No Students Found
</h3>



:


students.map((student)=>(


<div

className="admin-card"

key={student._id}

>


<h3>

{student.name}

</h3>



<p>

📧 {student.email}

</p>



<p>

🏫 {student.college || "Not Available"}

</p>



<p>

💻 {student.branch || "Not Available"}

</p>



<button>

View Profile

</button>



</div>



))


}




</div>



</div>



</>


);


}



export default Students;