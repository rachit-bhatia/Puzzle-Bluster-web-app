import { db } from '../../firebase/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth } from "../../firebase/firebase";
import React from 'react';

export default class AchievementManagerMath {
    static notificationQueue: string[] = [];
    static isNotifying: boolean = false;
    static async awardAchievement(achievementName: string): Promise<void> {
        const user = auth.currentUser;

        if (user) {
            const userRef = doc(db, "users", user.email);

            try {
                const docSnapshot = await getDoc(userRef);

                // Check if the achievement is already unlocked
                if (docSnapshot.exists()) {
                    const achievements = docSnapshot.data()?.achievements || [];

                    if (achievements.includes(achievementName)) {
                        console.log(`Achievement ${achievementName} is already unlocked.`);
                        return; // Exit the function if the achievement is already unlocked
                    }
                }

                // If not unlocked, proceed to award the achievement
                await updateDoc(userRef, {
                    achievements: arrayUnion(achievementName)
                });

                console.log(`Achievement Unlocked: ${achievementName}`);
                AchievementManagerMath.queueNotification(achievementName);
            } catch (error) {
                console.error("Error awarding achievement: ", error);
            }
        } else {
            console.error("No authenticated user found");
        }
    }

    static queueNotification(achievementName: string): void {
        this.notificationQueue.push(achievementName);
        if (!this.isNotifying) {
            this.processNotificationQueue();
        }
    }

    static async processNotificationQueue(): Promise<void> {
        this.isNotifying = true;
        while (this.notificationQueue.length > 0) {
            const achievementName = this.notificationQueue.shift();
            if (achievementName) {
                this.notifyUserOfAchievement(achievementName);
                await new Promise((resolve) => setTimeout(resolve, 3500)); // Wait for the previous notification to finish
            }
        }
        this.isNotifying = false;
    }

    static notifyUserOfAchievement(achievementName: string): void {
        // Display a custom popup message to the user
        const notificationDiv = document.createElement('div');
        notificationDiv.style.position = 'fixed';
        notificationDiv.style.bottom = '20px';
        notificationDiv.style.right = '20px';
        notificationDiv.style.padding = '15px';
        notificationDiv.style.backgroundColor = 'rgb(211, 188, 166)';  
        notificationDiv.style.color = 'rgb(54, 40, 22)';  
        notificationDiv.style.fontSize = '16px';
        notificationDiv.style.borderRadius = '5px';
        notificationDiv.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        notificationDiv.style.zIndex = '9999'; 
        notificationDiv.innerText = `Congratulations! You've unlocked the achievement: ${achievementName}`;
    
        document.body.appendChild(notificationDiv);
    
        // Remove the notification after 3 seconds
        setTimeout(() => {
            document.body.removeChild(notificationDiv);
        }, 3000); // Show each notification for 3 seconds
    }
    

    static async checkAchievementStatus(achievementName: string): Promise<boolean> {
        const user = auth.currentUser;

        if (user) {
            const userRef = doc(db, "users", user.email);
            const docSnapshot = await getDoc(userRef);

            if (docSnapshot.exists()) {
                const achievements = docSnapshot.data()?.achievements || [];
                return achievements.includes(achievementName);
            }
        }
        return false;
    }

    static async checkAndAwardAchievements(timeElapsed: number, difficulty: string, levelId: string): Promise<void> {
        if (timeElapsed <= 60) {
            await AchievementManagerMath.awardAchievement("Quick Thinker");
        }

        if (await AchievementManagerMath.checkSolvedPuzzles() >= 10) {
            await AchievementManagerMath.awardAchievement("Math Wizard");
        }

        if (levelId === "level3" && timeElapsed <= 30) {
            if (difficulty === "easy") await AchievementManagerMath.awardAchievement("Lightning Solver Bronze");
            else if (difficulty === "medium") await AchievementManagerMath.awardAchievement("Lightning Solver Silver");
            else if (difficulty === "hard") await AchievementManagerMath.awardAchievement("Lightning Solver Gold");
        }

        if (timeElapsed >= 1200) {  // 20 minutes
            await AchievementManagerMath.awardAchievement("Endurance Solver");
        }

        if (levelId === "level3" && difficulty === "hard") {
            await AchievementManagerMath.awardAchievement("Puzzle Champion");
        }

        if (await AchievementManagerMath.checkImprovement(timeElapsed, difficulty, levelId)) {
            if (difficulty === "easy") await AchievementManagerMath.awardAchievement("Improvement Specialist Bronze");
            else if (difficulty === "medium") await AchievementManagerMath.awardAchievement("Improvement Specialist Silver");
            else if (difficulty === "hard") await AchievementManagerMath.awardAchievement("Improvement Specialist Gold");
        }
    }

    static async checkSolvedPuzzles(): Promise<number> {
        const user = auth.currentUser;

        if (user) {
            const userRef = doc(db, "users", user.email);
            const docSnapshot = await getDoc(userRef);
            if (docSnapshot.exists()) {
                return docSnapshot.data()?.solvedPuzzles?.length || 0;
            }
        }
        return 0;
    }

    static async checkImprovement(timeElapsed: number, difficulty: string, levelId: string): Promise<boolean> {
        const user = auth.currentUser;

        if (user) {
            const userRef = doc(db, "users", user.email);
            const levelStr = levelId.match(/\d+/);
            const levelNum = levelStr ? parseInt(levelStr[0]) : 1;
            const fieldKey = `${difficulty}${levelNum}gametime`;

            const docSnapshot = await getDoc(userRef);
            const bestTime = docSnapshot.data()?.[fieldKey];
            return bestTime && timeElapsed < bestTime - 10;
        }
        return false;
    }
}
