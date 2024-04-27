import "./sign-up.css";
import { Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase/firebase";
import {FaUser,FaLock} from "react-icons/fa"
function SignUpPage() {
  const [email, setEmail] = useState("");
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
    // You can add your logic for handling form submission here
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("sign up successful");
        setIsSignUpSuccessful(true);
      } catch (error) {
        setErrorMessage(errorMessage);
        console.log(error);
      }
      setIsSigningUp(false);
    }
  };

  return (
    // <div className="container">
    //   {isSignUpSuccessful && <Navigate to="/signin" replace={true} />}
    //   <form className="form" onSubmit={onSignUp}>
    //     <div className="formGroup">
    //       <label htmlFor="email" className="label">
    //         Email
    //       </label>
    //       <input
    //         type="email"
    //         id="email"
    //         name="email"
    //         placeholder="Enter your email"
    //         className="input"
    //         value={email}
    //         onChange={handleEmailChange}
    //       />
    //     </div>
    //     <div className="formGroup">
    //       <label htmlFor="password" className="label">
    //         Password
    //       </label>
    //       <input
    //         type="password"
    //         id="password"
    //         name="password"
    //         placeholder="Enter your password"
    //         className="input"
    //         value={password}
    //         onChange={handlePasswordChange}
    //       />
    //     </div>
    //     <div className="formGroup">
    //       <label htmlFor="confirmPassword" className="label">
    //         Confirm Password
    //       </label>
    //       <input
    //         type="password"
    //         id="confirmPassword"
    //         name="confirmPassword"
    //         placeholder="Confirm your password"
    //         className="input"
    //         value={confirmPassword}
    //         onChange={handleConfirmPasswordChange}
    //       />
    //     </div>
    //     <button type="submit" className="button">
    //       Sign Up
    //     </button>
    //     <p style={{ color: '#666', textAlign: 'center' }}>Already have an account? <a href="/signin" className="link-button">Sign In</a></p>
    //   </form>
    // </div>

    <div className="wrapper">
      {isSignUpSuccessful && <Navigate to="/signin" replace={true} />}
      <form action="" onSubmit={onSignUp}>
        <h1>Sign Up</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Email"
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
        </div>

        <button type="submit">Register</button>

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
