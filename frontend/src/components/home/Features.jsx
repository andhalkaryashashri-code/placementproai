import "./Features.css";


function Features() {


const features = [

{
title:"📝 Aptitude Tests",
desc:"Solve topic-wise and company-wise aptitude tests with instant score and detailed analysis."
},

{
title:"🤖 AI Resume Builder",
desc:"Create an ATS-friendly professional resume within minutes using AI assistance."
},

{
title:"🎤 AI Interview",
desc:"Practice HR and technical interviews with AI-based feedback and improvement tips."
},

{
title:"📊 Performance Analytics",
desc:"Track your scores, averages, weak subjects and overall placement readiness."
},

{
title:"🏢 Company Preparation",
desc:"Explore companies, eligibility criteria, packages, interview process and preparation roadmap."
},

{
title:"👨‍🏫 Teacher Dashboard",
desc:"Teachers can create tests, monitor student performance and analyze subject-wise progress."
}

];



return (

<section className="features-section">


<h2>
Why Choose PlacementProAI?
</h2>


<p className="features-subtitle">

Everything required for placement preparation in one platform.

</p>



<div className="features-container">


{
features.map((item,index)=>(


<div
className="feature-card"
key={index}
>


<h3>
{item.title}
</h3>


<p>
{item.desc}
</p>


</div>


))
}



</div>


</section>

);


}


export default Features;