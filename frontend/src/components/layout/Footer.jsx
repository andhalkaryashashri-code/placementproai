import { 
GraduationCap,
Mail,
Phone,
MapPin,
Facebook,
Instagram,
Linkedin,
Github
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Footer.css";


function Footer() {


return (

<footer className="footer">


<div className="footer-container">



<div className="footer-box">


<div className="footer-logo">


<GraduationCap size={34}/>


<h2>
PlacementProAI
</h2>


</div>



<p>

Empowering students with AI-powered placement
preparation, mock tests and career guidance.

</p>



</div>





<div className="footer-box">


<h3>
Quick Links
</h3>


<Link to="/">
Home
</Link>


<Link to="/about">
About
</Link>


<Link to="/contact">
Contact
</Link>



</div>






<div className="footer-box">


<h3>
Portals
</h3>


<Link to="/student">
Student
</Link>


<Link to="/teacher">
Teacher
</Link>


<Link to="/admin/login">
Admin
</Link>



</div>






<div className="footer-box">


<h3>
Contact
</h3>


<p>
<Mail size={18}/>
support@placementproai.com
</p>


<p>
<Phone size={18}/>
+91 98765 43210
</p>


<p>
<MapPin size={18}/>
Pune, Maharashtra
</p>



</div>



</div>





<div className="footer-social">


<Facebook/>

<Instagram/>

<Linkedin/>

<Github/>


</div>



<hr/>


<div className="copyright">

© 2026 PlacementProAI | All Rights Reserved

</div>



</footer>

);


}


export default Footer;