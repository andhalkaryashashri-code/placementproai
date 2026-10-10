import { useNavigate } from "react-router-dom";
import { User, GraduationCap } from "lucide-react";
import "./PortalCards.css";

function PortalCards() {
  const navigate = useNavigate();

  return (
    <section className="portal-section">
      <div className="portal-heading">
        <h2>Choose Your Portal</h2>
        <p>
          Login to your dedicated dashboard and manage your placement journey.
        </p>
      </div>

      <div className="portal-container">
        {/* Student */}
        <div
          className="portal-card"
          onClick={() => navigate("/student")}
        >
          <div className="portal-icon student">
            <User size={38} />
          </div>

          <h3>Student</h3>

          <p>
            Register, attend aptitude tests, coding tests and monitor your
            progress.
          </p>

          <button>Continue</button>
        </div>

        {/* Teacher */}
        <div
          className="portal-card"
          onClick={() => navigate("/teacher")}
        >
          <div className="portal-icon teacher">
            <GraduationCap size={38} />
          </div>

          <h3>Teacher</h3>

          <p>
            Create tests, manage questions and evaluate students.
          </p>

          <button>Login</button>
        </div>
      </div>
    </section>
  );
}

export default PortalCards;