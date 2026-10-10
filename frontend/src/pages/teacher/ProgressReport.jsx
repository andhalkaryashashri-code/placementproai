import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "../../styles/ProgressReport.css";


function ProgressReport(){


const { testId } = useParams();


const [reports,setReports] = useState([]);

const [averageScore,setAverageScore] = useState(0);





useEffect(()=>{

loadReports();

},[testId]);







const loadReports = async()=>{


try{


const res = await API.get(`/performance/test/${testId}`);


console.log("TEST ID:",testId);

console.log("REPORT:",res.data);



const data = res.data.data || [];



setReports(data);





if(data.length > 0){



const total = data.reduce(

(sum,item)=> sum + Number(item.score || 0),

0

);



const avg = total / data.length;



setAverageScore(avg.toFixed(2));


}


else{


setAverageScore(0);


}



}



catch(error){


console.log(
error.response?.data || error
);


}



};









return(


<>


<Navbar/>



<div className="progress-container">





<h1>
📈 Progress Report
</h1>



<p>
Track improvement of students.
</p>







<div className="analytics-card">


<h2>
Performance Analytics
</h2>


<p>
Average Score : {averageScore}
</p>


<p>
Total Students : {reports.length}
</p>


</div>









<table>


<thead>


<tr>


<th>
Student Name
</th>


<th>
Email
</th>


<th>
Test
</th>


<th>
Score
</th>


<th>
Percentage
</th>


</tr>


</thead>






<tbody>




{

reports.length === 0 ?



<tr>


<td colSpan="5">

No Report Available

</td>


</tr>





:



reports.map((r)=>(



<tr key={r._id}>


<td>

{r.userId?.name}

</td>



<td>

{r.userId?.email}

</td>



<td>

{r.testId?.title || r.testName}

</td>




<td>

{r.score}

</td>




<td>

{Number(r.percentage).toFixed(2)}%

</td>




</tr>



))


}





</tbody>



</table>






</div>




</>


)


}



export default ProgressReport;