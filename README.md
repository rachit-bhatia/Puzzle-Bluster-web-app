# FIT 3170 Project Repository (Semester 1, 2024)

# Puzzle Game

## Group 1

Contributors: \
**SubTeam1:** \
[PM]Wong Jia Xuan - jwon0164@student.monash.edu \
[SA]Chua Xian Loong - xchu0015@student.monash.edu \
[RTE]Andreas - akok0011@student.monash.edu \

**SubTeam2:** \
[PM]Rachit Bhatia - rbha0031@student.monash.edu \
[SA]Anas Tarek Qumhiiyeh - aqum0001@student.monash.edu \
[RTE]Tan Jun Yu - jtan0245@student.monash.edu \

**SubTeam3:** \
[PM]Ibrahim - mmoh0156@student.monash.edu \
[SA]Aditti Gupta - agup0031@student.monash.edu \
[RTE]Parth Pandit - ppan0022@student.monash.edu


# **Project Handover Documentation**

## Project Overview
This project is a puzzle game featuring two different types of games, namely, Word Search (word puzzle) and Matrix Frenzy (maths puzzle). Each puzzle has three levels of difficulty with multiple levels for each difficulty. It also includes a user authentication system with account login and guest login options, as well as a leaderboard to track high scores.

## Software Requirements
- **Backend:**
    - Language: TypeScript
    - Framework: Nest.JS
    - Package Manager: Node.JS
- **Frontend:**
    - Framework: React.JS
- **Database Management System and Authentication:** 
    - Firebase

## Hardware Requirements
- **Primary Development, Testing and Deployment:**
    - Laptop or PC

 - **Future Deployment:**
    - The game can also be run on mobile devices once an APK is created.

## Setup Instructions
1. Clone the Repository
2. Navigate to Project Directory in your system
3. Install Dependencies: 
    Make sure you have Node.js installed. Then, run the following command to install all necessary dependencies: `npm install`
4. Running the Development Server: Use the following command to start the development server: `npm run dev`
5. Frontend and Backend Configuration
Ensure that the frontend and backend are properly configured to communicate with each other. Check the API endpoints and environment variables configuration.
6. Database Setup:
Configure Firebase with your project. Make sure to set up Firebase authentication and Firestore database according to your project needs. To do so, you may verify and change the `firebaseConfig` in the file [firebase.js](https://git.infotech.monash.edu/puzzle-game/group1puzzlegame/-/blob/main/src/firebase/firebase.js?ref_type=heads)

## Common Issues and Troubleshooting
- **Development Server Not Starting:** Ensure all dependencies are installed correctly. Run npm install again if necessary.
- **Firebase Configuration Errors:** Double-check the Firebase project credentials and configuration files (e.g., .env file or Firebase config in the code). Ensure the Firebase SDK is correctly set up in both the frontend and backend.

## Additional Notes
- **Useful Commands:**
    - To build the project for production: `npm run build`
    - To run tests: `npm test`

- **Debugging Tips:**
    - Use the browser’s developer tools to debug frontend issues.
    - For backend debugging, use Nest.JS's built-in logger or integrate a logging library for more detailed logs.

- **Further Resources:**
    - Nest.JS Documentation: https://docs.nestjs.com/ 
    - React.JS Documentation: https://react.dev/ 
    - Firebase Documentation: https://firebase.google.com/docs 


