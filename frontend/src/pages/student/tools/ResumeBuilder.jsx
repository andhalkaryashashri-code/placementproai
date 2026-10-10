import { useState } from "react";
import API from "../../../api/axios";
import Navbar from "../../../components/layout/Navbar";
import "../../../styles/ResumeBuilder.css";


function ResumeBuilder() {


const initialForm = {

name:"",
email:"",
phone:"",
location:"",
linkedin:"",
github:"",
education:"",
skills:"",
projects:"",
internship:"",
certifications:"",
softSkills:"",
languages:"",

};




const [form,setForm] = useState(initialForm);

const [resume,setResume] = useState("");

const [loading,setLoading] = useState(false);

const [copied,setCopied] = useState(false);





const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};







const validate=()=>{


if(
!form.name ||
!form.email ||
!form.phone ||
!form.education
)

{

alert("Please fill required fields");

return false;

}


return true;


};









const generateResume=async()=>{


if(!validate())
return;



try{


setLoading(true);




const details = `


Create a professional ATS friendly resume.



STRICT RULES:

- Use ONLY information provided by student.
- Do NOT add any extra information.
- Do NOT create fake projects.
- Do NOT create fake internship.
- Do NOT add extra skills.
- Do NOT add fake certifications.
- Do NOT add languages unless provided.
- Improve grammar and formatting only.
- Give only resume.
- No explanation.
- No markdown symbols.





STUDENT DETAILS:





Name:

${form.name}





Email:

${form.email}





Phone:

${form.phone}





Location:

${form.location}





LinkedIn:

${form.linkedin}





GitHub:

${form.github}







Education:

${form.education}







Technical Skills:

${form.skills}







Projects:

${form.projects}







Internship:

${form.internship}







Certifications:

${form.certifications}







Soft Skills:

${form.softSkills}







Languages Known:

${form.languages}








Create only these sections if data exists:



Professional Title

Professional Summary

Education

Technical Skills

Projects

Internship Experience

Certifications

Soft Skills

Languages Known




Summary must be based ONLY on given information.



Final resume must not contain invented information.



`;





const response = await API.post(

"/ai/resume",

{
details
}

);



setResume(
response.data.resume || "Resume generation failed"
);



}

catch(error){


console.log(error);


alert("AI Resume generation failed");


}

finally{


setLoading(false);


}


};
const copyResume = async()=>{

await navigator.clipboard.writeText(resume);

setCopied(true);


setTimeout(()=>{

setCopied(false);

},2000);


};







const downloadResume=()=>{


const blob = new Blob(

[resume],

{
type:"text/plain"
}

);



const url = URL.createObjectURL(blob);


const link = document.createElement("a");


link.href=url;


link.download="AI_Professional_Resume.txt";


document.body.appendChild(link);


link.click();


document.body.removeChild(link);


URL.revokeObjectURL(url);


};








const clearForm=()=>{


setForm(initialForm);

setResume("");

};









return(

<>


<Navbar/>




<div className="student-dashboard">



<h1>

🚀 AI Professional Resume Builder

</h1>





<div className="profile-card">



<h2>
👤 Personal Information
</h2>




<input
name="name"
placeholder="Full Name *"
value={form.name}
onChange={handleChange}
/>



<input
name="email"
placeholder="Email *"
value={form.email}
onChange={handleChange}
/>




<input
name="phone"
placeholder="Phone Number *"
value={form.phone}
onChange={handleChange}
/>




<input
name="location"
placeholder="Location"
value={form.location}
onChange={handleChange}
/>




<input
name="linkedin"
placeholder="LinkedIn URL"
value={form.linkedin}
onChange={handleChange}
/>




<input
name="github"
placeholder="GitHub URL"
value={form.github}
onChange={handleChange}
/>







<h2>
🎓 Education
</h2>


<textarea
name="education"
placeholder="Education Details"
value={form.education}
onChange={handleChange}
/>








<h2>
💻 Technical Skills
</h2>



<textarea
name="skills"
placeholder="Java, Python, React, SQL, MongoDB..."
value={form.skills}
onChange={handleChange}
/>




<p className="counter">

{form.skills.length} characters

</p>







<h2>
📂 Projects
</h2>


<textarea
name="projects"
placeholder="Project name, description, technologies..."
value={form.projects}
onChange={handleChange}
/>







<h2>
💼 Internship Experience
</h2>


<textarea
name="internship"
placeholder="Company name, role, duration..."
value={form.internship}
onChange={handleChange}
/>








<h2>
🏆 Certifications
</h2>



<textarea
name="certifications"
placeholder="Certificates and achievements"
value={form.certifications}
onChange={handleChange}
/>








<h2>
🤝 Soft Skills
</h2>



<textarea
name="softSkills"
placeholder="Communication, Teamwork, Leadership..."
value={form.softSkills}
onChange={handleChange}
/>








<h2>
🌐 Languages Known
</h2>



<textarea
name="languages"
placeholder="English, Hindi, Marathi..."
value={form.languages}
onChange={handleChange}
/>









<div className="button-group">


<button
onClick={generateResume}
disabled={loading}
>


{

loading

?

"⏳ Generating..."

:

"✨ Generate Resume"

}


</button>





<button
className="clear-btn"
onClick={clearForm}
>

🗑 Clear

</button>



</div>



</div>









{

resume &&


<div className="profile-card resume-box">



<div className="resume-header">


<h2>
📄 Generated AI Resume
</h2>




<div className="resume-actions">


<button
className="copy-btn"
onClick={copyResume}
>

{

copied

?

"✅ Copied"

:

"📋 Copy"

}


</button>





<button
className="download-btn"
onClick={downloadResume}
>

⬇ Download

</button>



</div>



</div>







<div className="resume-content">


<pre>

{resume}

</pre>



</div>




</div>


}





</div>


</>


);



}


export default ResumeBuilder;