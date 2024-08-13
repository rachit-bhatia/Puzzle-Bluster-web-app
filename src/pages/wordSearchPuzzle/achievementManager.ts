import { db } from '../../firebase/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth } from "../../firebase/firebase";
import React from 'react';

export default class AchievementManager {
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
                AchievementManager.queueNotification(achievementName);
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

    static async checkAndAwardAchievements(timeElapsed: number, difficulty: string, levelId: string, foundWords: string[], wordsToFind: string[]): Promise<void> {
        // Check for "Speedster" achievement
        if (timeElapsed <= 60) {  
            await AchievementManager.awardAchievement("Speedster");
        }

        // Check for "Improvement" achievement
        if (await AchievementManager.checkImprovement(timeElapsed, difficulty, levelId)) {
            if (difficulty === "easy") await AchievementManager.awardAchievement("Improvement Bronze");
            else if (difficulty === "medium") await AchievementManager.awardAchievement("Improvement Silver");
            else if (difficulty === "hard") await AchievementManager.awardAchievement("Improvement Gold");
        }

        // Check for "Fastest Alive" achievements
        if (levelId === "level3" && timeElapsed <= 10) {
            if (difficulty === "easy") await AchievementManager.awardAchievement("Fastest Alive Bronze");
            else if (difficulty === "medium") await AchievementManager.awardAchievement("Fastest Alive Silver");
            else if (difficulty === "hard") await AchievementManager.awardAchievement("Fastest Alive Gold");
        }

        // Check for "Speed Demon" achievements
        if (levelId === "level3" && timeElapsed <= 15) {
            if (difficulty === "easy") await AchievementManager.awardAchievement("Speed Demon Bronze");
            else if (difficulty === "medium") await AchievementManager.awardAchievement("Speed Demon Silver");
            else if (difficulty === "hard") await AchievementManager.awardAchievement("Speed Demon Gold");
        }

        // Check for "Speed monster" achievements
        if (levelId === "level3" && timeElapsed <= 30) {
            if (difficulty === "easy") await AchievementManager.awardAchievement("Speed monster Bronze");
            else if (difficulty === "medium") await AchievementManager.awardAchievement("Speed monster Silver");
            else if (difficulty === "hard") await AchievementManager.awardAchievement("Speed monster Gold");
        }

        // Check for "Marathoner" achievement
        if (timeElapsed >= 600000) {  // 10 minutes in milliseconds
            await AchievementManager.awardAchievement("Marathoner");
        }

        // Check for "Puzzle Champ" achievement
        if (levelId === "level3" && difficulty === "hard") {
            await AchievementManager.awardAchievement("Word search champ");
        }

        // Check for "First Step Bronze, Silver, Gold" achievements
        if (foundWords.length === wordsToFind.length && levelId === "level1") {
            if (difficulty === "easy") await AchievementManager.awardAchievement("First Step Bronze");
            else if (difficulty === "medium") await AchievementManager.awardAchievement("First Step Silver");
            else if (difficulty === "hard") await AchievementManager.awardAchievement("First Step Gold");
        }
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
            return bestTime && timeElapsed < bestTime - 10;  // 10 seconds improvement
        }
        return false;
    }

}
