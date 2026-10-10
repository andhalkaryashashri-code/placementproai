import { Brain, BookOpen, Target, Trophy } from "lucide-react";
import "./AboutSection.css";


function AboutSection() {


return (

<section className="about">



<div className="about-left">


<span className="about-tag">
ABOUT PLACEMENTPROAI
</span>



<h2>

One Platform For

<span>
 Complete Placement Preparation
</span>

</h2>



<p>

PlacementProAI helps students prepare for aptitude,
coding and interview rounds while enabling teachers
to create tests and monitor student performance.
Administrators can efficiently manage the complete
placement ecosystem from one centralized platform.

</p>



<div className="about-grid">



<div className="about-card">

<Brain size={35}/>

<h3>
AI Practice
</h3>

<p>
Practice smarter with AI-generated questions.
</p>

</div>




<div className="about-card">

<BookOpen size={35}/>

<h3>
Learning
</h3>

<p>
Access placement-oriented study material.
</p>

</div>





<div className="about-card">

<Target size={35}/>

<h3>
Mock Tests
</h3>

<p>
Experience real placement exam patterns.
</p>

</div>





<div className="about-card">

<Trophy size={35}/>

<h3>
Success
</h3>

<p>
Track progress and improve continuously.
</p>

</div>




</div>


</div>




<div className="about-right">


<div className="circle1"></div>

<div className="circle2"></div>



<img

src="/about.png"

alt="Placement preparation"

 />


</div>



</section>

);


}


export default AboutSection;