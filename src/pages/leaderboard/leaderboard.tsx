import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./leaderboard.css";
import BackButton from "../../components/backButton";
import { getAuth } from "firebase/auth";
import { UserAccount } from "../../models/shared";
import { act } from "react-dom/test-utils";
function Leaderboard() {
  const navigate = useNavigate();

  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("Math");

  // Handler to change the active tab
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  //   const [userUid, setUserUid] = useState<string>("");
  const [userRetrieved, setUserRetrieved] = useState<UserAccount | null>(null);

  // Current user rank in each puzzle game
  const [mathRank, setMathRank] = useState<number | null>(null);
  const [wordRank, setWordRank] = useState<number | null>(null);
  const [overallRank, setOverallRank] = useState<number | null>(null);

  // List of users in ascending order based on ranks
  const [mathSortedUsers, setMathSortedUsers] = useState<UserAccount[] | null>(
    null
  );
  const [wordSortedUsers, setWordSortedUsers] = useState<UserAccount[] | null>(
    null
  );
  const [overallSortedUsers, setOverallSortedUsers] = useState<
    UserAccount[] | null
  >(null);
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const fetchUserData = async () => {
      if (user) {
        try {
          // Fetch data for math, word, and overall concurrently
          const [userAccount, mathData, wordData, overallData] =
            await Promise.all([
              UserAccount.getUserByUuid(user.uid),
              UserAccount.getUserRank(user.uid, "math"),
              UserAccount.getUserRank(user.uid, "word"),
              UserAccount.getUserRank(user.uid, "overall"),
            ]);

          // Update state with the fetched data
          setUserRetrieved(userAccount);

          setMathRank(mathData?.rank ?? null);
          setMathSortedUsers(mathData?.sortedUsers ?? null);

          setWordRank(wordData?.rank ?? null);
          setWordSortedUsers(wordData?.sortedUsers ?? null);

          setOverallRank(overallData?.rank ?? null);
          setOverallSortedUsers(overallData?.sortedUsers ?? null);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const ProfileSection: React.FC = () => {
    return (
      <div className="profile-section">
        <img src="user-image-url" alt="Profile" className="profile-image" />

        <div className="profile-info">
          <h1 className="profile-name">
            {userRetrieved?.username?.split("@")[0]}
          </h1>

          <div className="profile-ranks">
            <div className="profile-rank">
              <span>Math Rank</span>
              <h2>{mathRank ?? "N/A"}</h2>
            </div>
            <div className="profile-rank">
              <span>Word Rank</span>
              <h2>{wordRank ?? "N/A"}</h2>
            </div>
          </div>
        </div>
        <div className="profile-rank">
          <span>Overall Rank</span>
          <h2>{overallRank ?? "N/A"}</h2>
        </div>
      </div>
    );
  };

  const TabNavigation: React.FC = () => {
    return (
      <div className="tab-navigation">
        <button
          className={`tab ${activeTab === "Math" ? "active" : ""}`}
          onClick={() => handleTabClick("Math")}
        >
          Math
        </button>
        <button
          className={`tab ${activeTab === "Word" ? "active" : ""}`}
          onClick={() => handleTabClick("Word")}
        >
          Word
        </button>
        <button
          className={`tab ${activeTab === "Overall" ? "active" : ""}`}
          onClick={() => handleTabClick("Overall")}
        >
          Overall
        </button>
      </div>
    );
  };

  const ScoreList: React.FC = () => {
    // Define default values or handle empty case


    const sortedUsers = activeTab === "Word"
    ? wordSortedUsers
    : activeTab === "Math"
    ? mathSortedUsers
    : overallSortedUsers;

    if (!sortedUsers || sortedUsers.length === 0) {
        return <p>No data available</p>;
      }
    
    return (
        <div className="score-list">
        {sortedUsers.map((user, index) => {
          // Display the username or "N/A" if it's null
          const displayName = user.username ? user.username.split("@")[0] : "N/A";
          
          // Determine the score to display based on activeTab
          let score: number;
          if (activeTab === 'Word') {
            score = user.wordScore ?? 0;
          } else if (activeTab === 'Math') {
            score = user.mathScore ?? 0;
          } else { // activeTab === 'overall'
            score = (user.wordScore ?? 0) + (user.mathScore ?? 0);
          }
  
          return (
            <div key={index} className="score-item">
              <div className="rank">{index + 1}</div>
              {/* Assuming index as rank */}
              <div className="score-info">
                <div className="name">{displayName}</div>
                {/* Use displayName */}
                <div className="score">{score}</div>
                {/* Display the score based on activeTab */}
                <div className="rank-number">Overall Rank {index + 1}</div>
              </div>
            </div>
          );
        })}
      </div>
      );
  };

  // Front End Section
  return (
    <div className="container">
      <div className="header">
        <BackButton></BackButton>
        <h4 className="title">Leaderboard</h4>
      </div>

      <div className="page-content">
        <ProfileSection />
        <TabNavigation />
        <ScoreList />
      </div>
    </div>
  );
}

export default Leaderboard;
