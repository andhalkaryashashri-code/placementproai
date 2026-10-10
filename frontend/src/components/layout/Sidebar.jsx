import { Link } from "react-router-dom";


function Sidebar({role}){


return(

<div className="sidebar">


<h3>
Menu
</h3>



{
role==="student" &&

<>

<Link to="/student/dashboard">
Dashboard
</Link>


<Link to="/profile">
Profile
</Link>


<Link to="/aptitude">
Aptitude Test
</Link>


<Link to="/student/tests">
My Tests
</Link>


</>

}






{
role==="teacher" &&

<>

<Link to="/teacher/dashboard">
Dashboard
</Link>


<Link to="/teacher/add-test">
Add Test
</Link>


</>

}






{
role==="admin" &&

<>

<Link to="/admin">
Admin Panel
</Link>


</>

}




</div>

)


}


export default Sidebar;