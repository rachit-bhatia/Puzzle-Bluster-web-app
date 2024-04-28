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
    console.log("clicked")
    if (!isSigningIn) {
      setIsSigningIn(true);

      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("sign in successful");
        setIsSigningInSuccessful(true);
        setErrorMessage("")
      } catch (error) {
        setErrorMessage(error.message);
        console.log(error.message);
      }

      setIsSigningIn(false);
    }
  };

  return (

   

      <div className="wrapper">

          {isSignInSuccessful && <Navigate to="/home" replace={true} />}

          
         <form action="" onSubmit={onSignIn}>
           <h1>Sign In</h1>

           <div className="error-message">
                {errorMessage && <p>{errorMessage}</p>}
            </div>

           <div className="input-box">
              <input type="text" placeholder="Email" value={email} onChange={handleEmailChange} />
              <FaUser className="icon"/>
           </div>
           <div className="input-box">
              <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
              <FaLock className="icon"/>
           </div>

           <div className="forgot-password">
             <a href="#">Forgot Password?</a>
           </div>

           <button type="submit" disabled={isSigningIn || !(email !== "" && password !== "")} >Login</button>

           <div className="register-link">
              <p>Don't have an account? <a href="/signup">Register</a></p>
           </div>

         </form>

      </div>

    
  );
}

export default SignInPage;
