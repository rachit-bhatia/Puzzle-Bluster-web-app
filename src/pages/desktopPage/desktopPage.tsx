import React from "react";
import NavBar from "../../components/navBar";
import { useNavigate } from "react-router-dom";
import "./desktopPage.css";

const DesktopPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="desktop-page">
      <NavBar />
      <main className="main-content">
        <div className="content-container">
          <div className="text-content">
            <h1 className="headline">
              Unlock Your <span className="highlight">Mind</span>, One
              <br />
              Puzzle at a <span className="highlight">Time!</span>
            </h1>
            <p className="desktop-subtitle">Multiple puzzle games</p>
            <div className="button-container">
              <button
                className="action-button start-button"
                onClick={() => navigate("/home-guest")}
              >
                Start Now
              </button>
            </div>
          </div>
          <div className="image-content">
            <img
              src="/img/homepage.png"
              alt="Puzzle Grid"
              className="puzzle-image"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesktopPage;
