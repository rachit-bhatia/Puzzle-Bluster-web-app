// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSkLLvxctonDcO7fSfTBoFZQQia5czW9M",
  authDomain: "fit3170-puzzlebluster.firebaseapp.com",
  projectId: "fit3170-puzzlebluster",
  storageBucket: "fit3170-puzzlebluster.appspot.com",
  messagingSenderId: "1026408339096",
  appId: "1:1026408339096:web:ac55bfae4e46e34145a2ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
export {app,auth,db}