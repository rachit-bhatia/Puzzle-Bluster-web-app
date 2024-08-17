import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase"; // Import Firebase auth
import "./accountPage.css";

const AccountPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const usernameFromEmail = user?.email?.split("@")[0] || "";
      setUsername(usernameFromEmail);
    }
  }, []);

  return (
    <div className="account-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate("/home")}>
          ←
        </button>
        <h4 className="title">Account</h4>
        <h6 className="subtitle">Profile</h6>
      </div>
      <main className="main-content">
        <section className="user-id">
          <div className="id-picture">
            <img src="./public/img/images.jpg" alt="ID" />
          </div>
          <div className="id">
            <span className="id-label">ID</span>
            <span className="id-number">123456789</span>
          </div>
        </section>
        <section className="account-info">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-info-1">
                <div className="avatar">Avatar</div>
                <div className="profile-info-2">
                  <div className="profile-info-2-1">
                    <span className="rank">
                      RANK
                      <span className="rank-number">1</span>
                    </span>
                    <div className="username">{username}</div>
                    <button
                      className="settings"
                      onClick={() => navigate("/account-details")}
                    >
                      settings
                    </button>
                  </div>
                  <div className="profile-info-2-2">
                    <div className="stat-buttons">
                      <button className="stat-button">Stat 1</button>
                      <button className="stat-button">Stat 2</button>
                    </div>
                  </div>

                  <div className="profile-info-3">
                    <div className="bio-section">
                      <span>Bio</span>
                      <button className="edit-button">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="stats-card">
            <div className="high-score">
              <h3>High Score</h3>
              <div className="score-bar">
                <div className="scores">
                  <span className="score">Score 1</span>
                  <span className="score">Score 2</span>
                </div>
              </div>
            </div>
            <div className="achievement-status">
              <h3>Achievement Status</h3>
              <div className="status-bar">
                <div className="statuses">
                  <span className="status">Status 1</span>
                  <span className="status">Status 2</span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default AccountPage;
