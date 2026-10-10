import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "../../styles/TeacherDashboard.css";


function StudentTests(){


const navigate = useNavigate();


const [tests,setTests] = useState([]);

const [loading,setLoading] = useState(true);





useEffect(()=>{

loadTests();

},[]);





const loadTests = async()=>{


try{


const res = await API.get("/tests");


console.log("ALL TESTS:",res.data);



setTests(
res.data.tests || []
);



}

catch(error){


console.log(
error.response?.data || error
);


}

finally{


setLoading(false);


}


};







return(

<>

<Navbar/>




<div className="teacher-dashboard">


<h1>
📝 Teacher Assigned Tests
</h1>





{

loading ?


<h3>
Loading Tests...
</h3>



:


tests.length === 0 ?


<h3>
No Tests Assigned By Teacher
</h3>



:


<div className="card-grid">


{

tests.map((test)=>(


<div

className="dashboard-card"

key={test._id}

>


<h2>
{test.title}
</h2>



<p>
<b>Subject :</b> {test.subject}
</p>



<p>
<b>Marks :</b> {test.totalMarks}
</p>



<p>
<b>Duration :</b> {test.duration} Minutes
</p>





<button

onClick={()=>
navigate(`/aptitude/${test._id}`)
}

>

🚀 Start Test

</button>




</div>


))


}



</div>


}





</div>



</>

)

}



export default StudentTests;