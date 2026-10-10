import Navbar from "../../components/layout/Navbar";
import "../../styles/AdminDashboard.css";


function Admin(){


const admin = {

name:"Admin",

email:"admin@placementproai.com"

};





return(


<>


<Navbar/>




<div className="admin-dashboard">






<h1>

Welcome {admin.name} 👨‍💼

</h1>





<p className="subtitle">

Manage PlacementProAI platform and users 🚀

</p>









<div className="profile-card">



<h2>

👤 Admin Profile

</h2>




<p>

<b>Name:</b> {admin.name}

</p>




<p>

<b>Email:</b> {admin.email}

</p>




<p>

<b>Role:</b> System Administrator

</p>




</div>












<h2>

⚡ Admin Controls

</h2>








<div className="admin-grid">







<div className="admin-card">


<h3>

👨‍🎓 Student Management

</h3>



<p>

View, update and manage students.

</p>



<button
onClick={()=>navigate("/admin/students")}
>
Manage
</button>


</div>









<div className="admin-card">


<h3>

👨‍🏫 Teacher Management

</h3>



<p>

Manage teachers and permissions.

</p>



<button>

Manage

</button>



</div>









<div className="admin-card">


<h3>

📚 Subject Management

</h3>



<p>

Add and manage technical subjects.

</p>



<button>

Manage

</button>



</div>









<div className="admin-card">


<h3>

📝 Test Management

</h3>



<p>

Monitor all aptitude tests.

</p>



<button>

View Tests

</button>



</div>









</div>







</div>




</>


)


}



export default Admin;