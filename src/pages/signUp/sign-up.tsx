import "./sign-up.css";
import { Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase/firebase";
import { FaUser, FaLock } from "react-icons/fa";
import React from "react";
import { UserAccount } from "../../models/shared";
function SignUpPage() {
  var [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };


  const onSignUp = async (event) => {
    event.preventDefault();
    // If not in the process of signing up ( firebase sign up API is not running)
    if (!isSigningUp) {


      // If all details are filled up
      if (email !== "" && password !== "" && confirmPassword !== "") {
        setIsSigningUp(true);
  
        try {
          email = email + "@email.com"
          let userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log("sign up successful");
          setIsSignUpSuccessful(true);
          setErrorMessage("");

          // if sign up successful , add new user to db
          console.log(userCredential.user.uid)
          let newUser = new UserAccount(userCredential.user.uid)
          newUser.username = email
          UserAccount.addUser(newUser)
          
        } catch (error) {
          if (error.message == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
            setErrorMessage("Password should be at least 6 characters");
          }  else if (error.message == "Firebase: Error (auth/email-already-in-use).") {
            setErrorMessage("Username already exists")
          }
          else {
            setErrorMessage(error.message)
          }
          console.log(error.message);
        }
        setIsSigningUp(false);
      } 
    }
  };

  const showErrorMessage = () => {
    if (errorMessage != ""){
      return (
        <div className="error-message" style={{width: "100%", 
                                               display: "flex", 
                                               justifyContent: "center",
                                               alignItems: "center",
                                               height: "30px"
                                               }}>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      )
    }
  }

  return (
    <div className="wrapper">
      {isSignUpSuccessful && <Navigate to="/signin" replace={true} />}
      <div className="home-decor" style={{top: "-150px", left: "-20px", transform: "rotate(60deg)"}}></div>
      <div className="home-decor" style={{bottom: "-120px", right: "-20px", transform: "rotate(20deg)"}}></div>
      <div className="home-decor2" style={{top: "50vh", left: "-130px", transform: "rotate(100deg)"}}></div>
      <div className="home-decor2" style={{top: "-20px", right: "-100px", transform: "rotate(-10deg)"}}></div>

      <form action="" onSubmit={onSignUp}>
        <h1>Sign Up</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={handleEmailChange}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <FaLock className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <FaLock className="icon" />
          <div className="password-not-matched">
            {!(password == confirmPassword) && <p>Password does not match</p>}
          </div>
        </div>

        {showErrorMessage()}

        <button type="submit" disabled={isSigningUp || !(email !== "" && password !== "" && confirmPassword !== "") || !(password == confirmPassword)}>Register</button>

        <div className="back-to-login">
          <p>
            Already have an account? <a href="/signin">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
