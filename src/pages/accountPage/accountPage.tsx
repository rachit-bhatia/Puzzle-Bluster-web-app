import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./accountPage.css";
import "../rewardManager/rewardManager.css"; // Import the rewardManager CSS
import BackButton from "../../components/backButton";
import { UserAccount } from "../../models/shared";
import { User } from "firebase/auth";

const AccountPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [latestAchievement, setLatestAchievement] = useState<string | null>(
    null
  );

  const[userAvatar,setUserAvatar] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMaleSelected, setIsMaleSelected] = useState<Boolean | null >(null)
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
   // Function to open the dialog
   const openDialog = () => {
    getUserAvatar()
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const changeToMaleSelected = () => {
    setIsMaleSelected(true);
  };

  const changeToFemaleSelected = () => {
    setIsMaleSelected(false);
  };

  
  const saveAvatar = async () => {
    if(userAccount){

      let success = false;
      if(userAvatar === "male" && !isMaleSelected){
        success = await UserAccount.changeAvatar("female", userAccount);
      }else if (userAvatar === "female" && isMaleSelected){
        success = await UserAccount.changeAvatar("male", userAccount);
      }


      if (success) {
        console.log('Avatar updated successfully.');
        // Optionally update UI or state here to reflect the successful update
        closeDialog()
        getUserAvatar()
      } else {
        console.error('Failed to update avatar.');
        // Optionally handle the failure case, e.g., show an error message
      }
    }
  
  };



  const getUserAvatar = async () => {
    if(auth.currentUser){
      const userAccount = await UserAccount.getUserByUuid(auth.currentUser.uid)
      setUserAccount(userAccount)
      setUserAvatar(userAccount.userAvatar? userAccount.userAvatar : "")  
      if(userAvatar === "male"){
        setIsMaleSelected(true)
      } else if (userAvatar === "female"){
        setIsMaleSelected(false)
      } else {
        null
      }
    }
  }

  useEffect(() => {
    const user = auth.currentUser

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
      getUserAvatar()
    }
  }, []);


  // Function to determine the image source
  const getAvatarSrc = () => {
    if (userAvatar === "") {
      return ""; // No image source
    } else if (userAvatar === "male") {
      return "./public/img/maleAvatar.jpg";
    } else if (userAvatar === "female") {
      return "./public/img/femaleAvatar.jpg";
    }
    return ""; // Default case if no match
  };

  return (

    <div className="account-page">
      <div className="header">
        <BackButton />
        <div className="title">Account</div>
        <div className="subtitle">Profile</div>
      </div>
      <main className="content">
        {/* <section className="user-id">
          <div className="id-picture">
            <img src="./public/img/images.jpg" alt="ID" />
          </div>
          <div className="id">
            <span className="id-label">ID</span>
            <span className="id-number">123456789</span>
          </div>
        </section> */}
        <section className="account-info">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-info-1">
                <div className="profile-avatar">
                  <img src={getAvatarSrc()} className="profile-image" />
                  <button onClick={openDialog}>Change Avatar</button>
                </div>
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
                    <div className="stat-labels">
                      <label className="stat-label">Stat 1</label>
                      <label className="stat-label">Stat 2</label>
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

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h2>Change Avatar</h2>
            <p>Please select an avatar.</p>
            <div className="avatar-selection-display">
              <div className="avatar-display">
                <img src="./public/img/maleAvatar.jpg" alt="Profile" className="profile-image" />
                <button disabled={isMaleSelected == true} className="select-button" onClick={changeToMaleSelected}>{isMaleSelected ? "Selected" : "Select"}</button>
              </div>
              <div className="avatar-display">
                <img src="./public/img/femaleAvatar.jpg" alt="Profile" className="profile-image" />
                <button disabled={isMaleSelected == false} className="select-button" onClick={changeToFemaleSelected}>{isMaleSelected ? "Select" : "Selected"}</button>
              </div>
            </div>
            <div className="button-row">
              <button className="close-button" onClick={closeDialog}>Close</button>
              <button className="save-button" onClick={saveAvatar}>Save</button>
            </div>
          
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
