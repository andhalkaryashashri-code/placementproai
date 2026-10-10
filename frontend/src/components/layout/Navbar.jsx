import { Link, useNavigate } from "react-router-dom";


function Navbar() {


const navigate = useNavigate();


const user = JSON.parse(
localStorage.getItem("user") || "null"
);



const logout = ()=>{

localStorage.removeItem("token");

localStorage.removeItem("user");

navigate("/");

};



return (


<nav

style={{

display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"18px 50px",
background:"#F7F3EA",
boxShadow:"0 2px 15px rgba(0,0,0,0.08)",
position:"sticky",
top:"0",
zIndex:"1000"

}}

>



<h2

style={{

color:"#6F4E37",
fontWeight:"700",
cursor:"pointer"

}}

onClick={()=>navigate("/")}

>

PlacementProAI

</h2>




<div

style={{

display:"flex",
alignItems:"center",
gap:"20px"

}}

>



{user && (

<>


{
user.role==="student" &&

<Link

to="/student/dashboard"

style={{

textDecoration:"none",
color:"#6F4E37",
fontWeight:"600"

}}

>

Dashboard

</Link>

}





{
user.role==="teacher" &&

<Link

to="/teacher/dashboard"

style={{

textDecoration:"none",
color:"#6F4E37",
fontWeight:"600"

}}

>

Dashboard

</Link>

}





{
user.role==="admin" &&

<Link

to="/admin"

style={{

textDecoration:"none",
color:"#6F4E37",
fontWeight:"600"

}}

>

Dashboard

</Link>

}




<button

onClick={logout}

style={{

padding:"10px 18px",
border:"none",
borderRadius:"8px",
background:"#8B6B4A",
color:"white",
cursor:"pointer"

}}

>

Logout

</button>



</>

)}



</div>



</nav>


);


}


export default Navbar;