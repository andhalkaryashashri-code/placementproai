import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";


function Companies(){


const companies=[

"TCS",
"Infosys",
"Wipro",
"Accenture",
"Capgemini",
"Cognizant",
"Amazon",
"Microsoft"

];


return(

<>

<Navbar/>


<div className="page">


<h1>
Partner Companies
</h1>


<p>
Prepare for top companies with PlacementPro AI.
</p>



<div className="company-container">


{
companies.map((company,index)=>(

<div className="company-card" key={index}>

<h2>
{company}
</h2>


<p>
Placement opportunities and preparation resources.
</p>


</div>

))

}


</div>


</div>


<Footer/>


</>

)

}


export default Companies;