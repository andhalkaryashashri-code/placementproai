import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/layout/Navbar";
import "../../styles/TeacherDashboard.css";


function Performance() {


const navigate = useNavigate();


const [showResults, setShowResults] = useState(false);

const { testId } = useParams();


const [results, setResults] = useState([]);



useEffect(() => {

loadResults();

}, []);





const loadResults = async () => {

try {

const res = await API.get(`/performance/test/${testId}`);


if (res.data.success) {

setResults(res.data.data);

}


}

catch(error) {

console.log(error);

}

};





return (

<>

<Navbar/>


<div className="teacher-dashboard">



<h1>
📊 Student Performance
</h1>



<p className="subtitle">
Analyze student test results and placement progress 🚀
</p>





<div className="analytics-card">


<h2>
Performance Analytics
</h2>


<p>
Average Score : 78%
</p>


<p>
Strong Topics : DBMS, Java, DSA
</p>


<p>
Need Improvement : Aptitude Speed
</p>


</div>







<div className="card-grid">





<div className="dashboard-card">


<h3>
👨‍🎓 Student Results
</h3>


<p>
View student marks and test attempts.
</p>



<button

onClick={() => setShowResults(!showResults)}

>

{

showResults

?

"Hide Results"

:

"View Results"

}


</button>



</div>







<div className="dashboard-card">


<h3>
📈 Progress Report
</h3>


<p>
Track improvement of students.
</p>



<button
onClick={()=>navigate(`/teacher/progress-report/${testId}`)}
>
Generate Report
</button>



</div>





</div>









{

showResults &&

(

<div

className="analytics-card"

style={{
marginTop:"30px",
overflowX:"auto"
}}

>


<h2>
Student Test Results
</h2>





<table

style={{

width:"100%",

borderCollapse:"collapse",

marginTop:"15px"

}}

>


<thead>

<tr>

<th style={thStyle}>
Student Name
</th>


<th style={thStyle}>
Email
</th>


<th style={thStyle}>
Score
</th>


<th style={thStyle}>
Percentage
</th>


</tr>

</thead>





<tbody>


{

results.map((student,index)=>(


<tr key={index}>


<td style={tdStyle}>

{student.userId?.name}

</td>



<td style={tdStyle}>

{student.userId?.email}

</td>



<td style={tdStyle}>

{student.score}

</td>



<td style={tdStyle}>

{Number(student.percentage).toFixed(2)}%

</td>



</tr>


))


}



</tbody>


</table>



</div>

)


}



</div>



</>

)


}





const thStyle = {

border:"1px solid #ddd",

padding:"12px",

backgroundColor:"#4f46e5",

color:"#fff",

textAlign:"left",

};



const tdStyle = {

border:"1px solid #ddd",

padding:"10px",

};



export default Performance;