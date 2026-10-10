import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import Hero from "../../components/home/Hero";
import PortalCards from "../../components/home/PortalCards";
import Features from "../../components/home/Features";
import AboutSection from "../../components/home/AboutSection";


function Home() {

  return (

    <>

      <Navbar />

      <main className="home-page">

        <Hero />

        <PortalCards />

        <Features />

        <AboutSection />

      </main>


      <Footer />

    </>

  );

}


export default Home;