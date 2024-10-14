import React from "react";
import { useNavigate } from "react-router-dom";
import "./navBar.css";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src="/img/logo.jpg" alt="Logo" />
        </div>
        <span className="navbar-title">Group1</span>
      </div>
      <div className="navbar-right">
        <button className="navbar-button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
        <button className="navbar-button" onClick={() => navigate("/signin")}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
