import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";


function Teacher(){


const navigate = useNavigate();



return(

<>

<Navbar/>



<div

className="page"

style={{

minHeight:"70vh",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
background:"#F8F4ED",
textAlign:"center"

}}

>


<h1
style={{
color:"#5C4033",
fontSize:"45px"
}}
>

Teacher Portal

</h1>



<p
style={{
color:"#666",
fontSize:"18px"
}}
>

Manage students, create tests and track performance.

</p>



<button

onClick={()=>navigate("/teacher/login")}

style={{

marginTop:"25px",
padding:"14px 35px",
border:"none",
borderRadius:"30px",
background:"#8B5E3C",
color:"white",
fontSize:"16px",
cursor:"pointer"

}}

>

Teacher Login

</button>




</div>



<Footer/>


</>

)


}


export default Teacher;