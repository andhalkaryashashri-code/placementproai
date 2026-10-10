import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/axios";
import "../../styles/StudentPerformance.css";
import { useParams } from "react-router-dom";

function StudentPerformance(){

const { studentId } = useParams();

const user = JSON.parse(
    localStorage.getItem("user") || "{}"
);



const [performance,setPerformance] = useState(null);

const [loading,setLoading] = useState(true);






useEffect(()=>{

loadPerformance();

},[]);








const loadPerformance = async()=>{


try{


console.log(
"LOGIN USER:",
user
);


const userId = studentId || user?._id;

if (!userId) {
  console.log("USER ID NOT FOUND");
  setLoading(false);
  return;
}

const res = await API.get(
  `/performance/student/${userId}`
);





console.log(
"PERFORMANCE RESPONSE:",
res.data
);






if(res.data.success){


setPerformance(
res.data.data
);


}





}

catch(error){


console.log(

"Performance Load Error",

error.response?.data || error

);


}



finally{


setLoading(false);


}



};









if(loading){


return(

<>

<Navbar/>


<div className="performance-page">


<h2>

Loading Performance...

</h2>


</div>


</>


);


}









if(!performance){


return(

<>

<Navbar/>


<div className="performance-page">


<h2>

No Performance Data Found

</h2>


<p>

Attempt tests to see your performance report.

</p>


</div>


</>


);


}










return(

<>


<Navbar/>





<div className="performance-page">






<h1>

📊 Detailed Performance Report

</h1>








<div className="performance-grid">





<div className="report-card">


<h2>

🎯 Overall Score

</h2>


<h1>

{performance.overallScore || 0}%

</h1>


</div>







<div className="report-card">


<h2>

📝 Total Tests

</h2>


<h1>

{performance.totalTests || 0}

</h1>


</div>







</div>









<div className="report-section">


<h2>

🔥 Strong Areas

</h2>





{

performance.strongAreas &&
performance.strongAreas.length > 0 ?



<div className="tag-container">


{

performance.strongAreas.map(

(item,index)=>(


<span

className="tag strong"

key={index}

>

✔ {item}

</span>


)


)


}



</div>



:


<p>

No strong areas available

</p>



}



</div>













<div className="report-section">


<h2>

⚠ Need Improvement

</h2>







{

performance.weakAreas &&
performance.weakAreas.length > 0 ?



<div className="tag-container">


{

performance.weakAreas.map(

(item,index)=>(


<span

className="tag weak"

key={index}

>

⚠ {item}

</span>


)


)


}



</div>



:


<p>

No improvement areas available

</p>



}



</div>













<div className="report-section">


<h2>

📚 Test History

</h2>






{

performance.performances &&
performance.performances.length > 0 ?





performance.performances.map(

(test)=>(


<div

className="test-card"

key={test._id}

>


<h3>

{test.testName}

</h3>




<p>

Subject :

{test.subject}

</p>





<p>

Score :

{test.score}/{test.totalQuestions}

</p>





<p>

Percentage :

{test.percentage}%

</p>





</div>



)


)





:



<p>

No tests attempted yet.

</p>



}





</div>








</div>





</>

);


}



export default StudentPerformance;