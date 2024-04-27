import "./sign-in.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import {FaUser,FaLock} from "react-icons/fa"

function SignInPage() {
  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignInSuccessful, setIsSigningInSuccessful] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSignIn = async (event) => {
    event.preventDefault();

    if (!isSigningIn) {
      setIsSigningIn(true);

      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("sign in successful");
        setIsSigningInSuccessful(true);
      } catch (error) {
        setErrorMessage(errorMessage);
        console.log(error);
      }

      setIsSigningIn(false);
    }
  };

  return (
    // <div className="container">
    //   {isSignInSuccessful && <Navigate to="/home" replace={true} />}

    //   <form className="form" onSubmit={onSignIn}>
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
    //     <button type="submit" className="button">
    //       Login
    //     </button>
    //     <p style={{ color: '#666', textAlign: 'center' }}>Don't have an account? <a href="/signup" className="link-button">Sign Up</a></p>
    //   </form>
    // </div>



      <div className="wrapper">
          {isSignInSuccessful && <Navigate to="/home" replace={true} />}
         <form action="" onSubmit={onSignIn}>
           <h1>Sign In</h1>
           <div className="input-box">
              <input type="text" placeholder="Email" value={email} onChange={handleEmailChange} />
              <FaUser className="icon"/>
           </div>
           <div className="input-box">
              <input type="text" placeholder="Password" value={password} onChange={handlePasswordChange}/>
              <FaLock className="icon"/>
           </div>

           <div className="forgot-password">
             <a href="#">Forgot Password?</a>
           </div>

           <button type="submit">Login</button>

           <div className="register-link">
              <p>Don't have an account? <a href="/signup">Register</a></p>
           </div>

         </form>

      </div>

    
  );
}

export default SignInPage;
