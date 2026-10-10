import { useParams } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import subjects from "../../../data/subjects";
import "../../../styles/StudentDashboard.css";


function SubjectDetails(){

const { subjectName } = useParams();


// URL subject name mapping

const subjectMap = {

"DSA":"DSA",

"DBMS":"DBMS",

"Operating System":"OperatingSystem",

"Computer Network":"ComputerNetwork",

"Java":"Java",

"Python":"Python",

"C Programming":"CProgramming",

"C++":"Cpp",

"SQL":"SQL",

"Web Development":"WebDevelopment",

"Software Engineering":"SoftwareEngineering",

"Cloud Computing":"CloudComputing",

"Cyber Security":"CyberSecurity",

"OOP Concepts":"OOPConcepts",

"Aptitude":"Aptitude"

};



const key = subjectMap[subjectName];


const subject = subjects[key];




return(

<>

<Navbar/>


<div className="student-dashboard">



{

subject ?


<>


<h1>
📘 {subject.title}
</h1>





{/* MOST IMPORTANT QUESTIONS */}

{

subject.mostImportant?.length > 0 &&

(

<div className="profile-card">


<h2>
⭐ Most Important Interview Questions
</h2>



{

subject.mostImportant.map((q,index)=>(

<p key={index}>

⭐ {index+1}. {q}

</p>

))

}



</div>

)

}









{/* IMPORTANT TOPICS */}


<div className="profile-card">


<h2>
📚 Important Topics
</h2>



{

subject.topics?.map((topic,index)=>(


<p key={index}>

✅ {index+1}. {topic}

</p>


))

}


</div>










{/* ALL INTERVIEW QUESTIONS */}


<div className="profile-card">


<h2>
❓ All Interview Questions
</h2>



{

subject.questions?.map((q,index)=>(


<p key={index}>

{index+1}. {q}

</p>


))

}


</div>





</>



:





<div className="profile-card">


<h2>
❌ Subject Content Not Available
</h2>


<p>
Subject key not found : {subjectName}
</p>


</div>


}



</div>


</>

)

}


export default SubjectDetails;