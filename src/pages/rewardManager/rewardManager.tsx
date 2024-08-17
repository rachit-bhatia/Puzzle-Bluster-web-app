/* rewardManager.tsx */
import React from "react";
import "./rewardManager.css";

interface RewardManagerProps {
  achievementName: string;
}

const RewardManager: React.FC<RewardManagerProps> = ({ achievementName }) => {
  return (
    <div className="reward-banner">
      <span className="reward-text">{achievementName}</span>
    </div>
  );
};

export default RewardManager;
