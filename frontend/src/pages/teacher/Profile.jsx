import Navbar from "../components/layout/Navbar";


function Profile(){


const user = JSON.parse(
localStorage.getItem("user")
);



return(

<>

<Navbar/>


<div className="page">


<h1>
Student Profile
</h1>


<h3>
Name : {user?.name}
</h3>


<h3>
Email : {user?.email}
</h3>


<h3>
Role : {user?.role}
</h3>



<div className="dashboard-card">

<h2>
Resume Upload
</h2>

<input type="file"/>

</div>



<div className="dashboard-card">

<h2>
Skills
</h2>

<p>
Add your technical skills here.
</p>

</div>


</div>


</>

)


}


export default Profile;