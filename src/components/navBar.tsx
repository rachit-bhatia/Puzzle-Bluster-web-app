import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./navBar.css";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src="/img/logo.jpg"></img>
        </div>
        <span className="navbar-title">Group1</span>
      </div>
      <div className="navbar-right">
        <a href="/desktopPage" className="navbar-link">
          HOMEPAGE
        </a>
        <a href="#" className="navbar-link">
          ABOUT US
        </a>
        <a href="#" className="navbar-link">
          PROFESSIONAL SERVICES
        </a>
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
