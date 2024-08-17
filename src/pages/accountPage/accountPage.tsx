import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import RewardManager from "../rewardManager/rewardManager";
import "./accountPage.css";
import "../rewardManager/rewardManager.css"; // Import the rewardManager CSS

const AccountPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [latestAchievement, setLatestAchievement] = useState<string | null>(
    null
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email) {
      const usernameFromEmail = user.email.split("@")[0];
      setUsername(usernameFromEmail);

      const fetchAchievements = async () => {
        const userRef = doc(db, "users", user.email);
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
          const userAchievements = docSnapshot.data()?.achievements || [];
          setAchievements(userAchievements);

          if (userAchievements.length > 0) {
            setLatestAchievement(userAchievements[userAchievements.length - 1]);
          }
        }
      };

      fetchAchievements();
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
                {achievements.length > 0 ? (
                  <div className="achievement-list">
                    {achievements.map((achievement, index) => {
                      let labelClass = "others";
                      if (achievement.toLowerCase().includes("bronze")) {
                        labelClass = "bronze";
                      } else if (achievement.toLowerCase().includes("silver")) {
                        labelClass = "silver";
                      } else if (achievement.toLowerCase().includes("gold")) {
                        labelClass = "gold";
                      }

                      return (
                        <div key={index} className="achievement-item">
                          <span className={`achievement-label ${labelClass}`}>
                            {achievement}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default AccountPage;
