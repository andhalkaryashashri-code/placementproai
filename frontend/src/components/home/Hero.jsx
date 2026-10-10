import { useNavigate } from "react-router-dom";
import { User, GraduationCap } from "lucide-react";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero-buttons">
      <button
        className="student-btn"
        onClick={() => navigate("/student")}
      >
        <User size={20} />
        Student
      </button>

      <button
        className="teacher-btn"
        onClick={() => navigate("/teacher")}
      >
        <GraduationCap size={20} />
        Teacher
      </button>
    </div>
  );
}

export default Hero;