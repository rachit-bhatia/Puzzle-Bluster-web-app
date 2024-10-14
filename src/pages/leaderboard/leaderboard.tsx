import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./leaderboard.css";
import BackButton from "../../components/backButton";
import { getAuth, User } from "firebase/auth";
import { UserAccount } from "../../models/shared";
import { act } from "react-dom/test-utils";
import { auth } from "../../firebase/firebase";
function Leaderboard() {
  const navigate = useNavigate();

  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("Math");

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

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

  const [userAvatar, setUserAvatar] = useState("");

  // Function to determine the image source
  const getAvatarSrc = () => {
    if (userAvatar === "") {
      return ""; // No image source
    } else if (userAvatar === "male") {
      return "/img/maleAvatar.jpg";
    } else if (userAvatar === "female") {
      return "/img/femaleAvatar.jpg";
    }
    return ""; // Default case if no match
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, retrieve their info
        setFirebaseUser(user);
      } else {
        // User is signed out or not logged in
        console.log("User is not logged in");
        setFirebaseUser(null); // Optional: Reset user state when logged out
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseUser) {
        try {
          // Fetch data for math, word, and overall concurrently
          const [userAccount, mathData, wordData, overallData] =
            await Promise.all([
              UserAccount.getUserByUuid(firebaseUser.uid),
              UserAccount.getUserRank(firebaseUser.uid, "math"),
              UserAccount.getUserRank(firebaseUser.uid, "word"),
              UserAccount.getUserRank(firebaseUser.uid, "overall"),
              UserAccount.getUserByUuid(firebaseUser.uid),
            ]);

          // Update state with the fetched data
          setUserRetrieved(userAccount);

          setMathRank(mathData?.rank ?? null);
          setMathSortedUsers(mathData?.sortedUsers ?? null);

          setWordRank(wordData?.rank ?? null);
          setWordSortedUsers(wordData?.sortedUsers ?? null);

          setOverallRank(overallData?.rank ?? null);
          setOverallSortedUsers(overallData?.sortedUsers ?? null);

          setUserAvatar(userAccount.userAvatar ? userAccount.userAvatar : "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [firebaseUser]); // Empty dependency array ensures this runs once when the component mounts

  const ProfileSection: React.FC = () => {
    return (
      <div className="profile-section-leaderboard">
        <img src={getAvatarSrc()} className="profile-image" />

        <div className="profile-info-leaderboard">
          <h1 className="profile-name-leaderboard">
            {userRetrieved?.username?.split("@")[0]}
          </h1>

          <div className="profile-ranks-leaderboard">
            <div className="profile-rank-leaderboard">
              <span>Matrix Frenzy</span>
              <h2>{mathRank ?? "N/A"}</h2>
            </div>
            <div className="profile-rank-leaderboard">
              <span>Word Search</span>
              <h2>{wordRank ?? "N/A"}</h2>
            </div>
          </div>
        </div>
        <div className="profile-rank-leaderboard">
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
          Matrix Frenzy
        </button>
        <button
          className={`tab ${activeTab === "Word" ? "active" : ""}`}
          onClick={() => handleTabClick("Word")}
        >
          Word Search
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
    const [searchTerm, setSearchTerm] = useState<string>(""); // State for the search input
  
    // Define default values or handle empty case
    const sortedUsers =
      activeTab === "Word"
        ? wordSortedUsers
        : activeTab === "Math"
        ? mathSortedUsers
        : overallSortedUsers;
  
    // Filter sortedUsers based on searchTerm
    const filteredUsers = (sortedUsers ?? []).filter((user) => {
      const displayName = user.username ? user.username.split("@")[0] : "N/A";
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    if (!sortedUsers || sortedUsers.length === 0) {
      return <p>No data available</p>;
    }
  
    return (
      <div className="score-list-container">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search player"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          className="search-bar-leaderboard"
        />
  
        <div className="score-list-leaderboard">
          {filteredUsers.length === 0 ? (
            <p>No players found</p>
          ) : (
            filteredUsers.map((user) => {
              const displayName = user.username
                ? user.username.split("@")[0]
                : "N/A";
              
              // Find the original rank from the sortedUsers array
              const originalRank =
                sortedUsers.findIndex(
                  (sortedUser) => sortedUser.userUuid === user.userUuid
                ) + 1; // Add 1 to adjust for 0-based index
  
              let score: number;
              if (activeTab === "Word") {
                score = user.wordScore ?? 0;
              } else if (activeTab === "Math") {
                score = user.mathScore ?? 0;
              } else {
                // activeTab === 'overall'
                score = (user.wordScore ?? 0) + (user.mathScore ?? 0);
              }
  
              let userOverallRank = overallSortedUsers?.findIndex(
                (overallUser) => overallUser.userUuid === user.userUuid
              );
              const overallRank =
                userOverallRank !== undefined ? userOverallRank + 1 : "N/A";
  
              return (
                <div key={user.userUuid} className="score-item-leaderboard">
                  <div className="rank-leaderboard">{originalRank}</div>
                  <div className="score-info-leaderboard">
                    <div className="name-leaderboard">{displayName}</div>
                    <div className="score-leaderboard">{score}</div>
                    <div className="rank-number-leaderboard">
                      Overall Rank {overallRank}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
