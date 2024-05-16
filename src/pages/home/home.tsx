import React from "react";
import { auth } from "../../firebase/firebase";
import{ useState } from 'react';
import { Navigate } from "react-router-dom";
import { UserAccount } from "../../models/shared";
function HomePage() {

  const [errorMessage, setErrorMessage] = useState('');
  const [isSignOutSuccessful,setIsSignOutSuccessful] = useState(false)

  const onSignOut = async (event) => {
    event.preventDefault();
    // You can add your logic for handling form submission here
   

    try {
      await auth.signOut()
      console.log("sign out successful")
      setIsSignOutSuccessful(true)

    }catch(error){
      setErrorMessage(errorMessage)
      console.log(error)
    }

    
  }

  // REMOVE THIS ( JUST FOR TESTING)
  const getUsers = async (event) => {
    event.preventDefault();

    await UserAccount.getCollection()
    console.log(UserAccount.users)
    
  }
  return (
    <div>
      {isSignOutSuccessful &&  <Navigate to="/signin" replace={true} /> }
      <h2>Home</h2>
      <p>Welcome to the Home page!</p>
      <button onClick={onSignOut}>Sign Out</button>

      {/* REMOVE THIS ( JUST FOR TESTING*/}
      <button onClick={getUsers}>Get users</button>
    </div>
  );
}

export default HomePage;