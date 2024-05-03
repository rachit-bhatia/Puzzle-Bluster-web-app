import { auth } from "../../firebase/firebase";
import{ useState } from 'react';
import { Navigate } from "react-router-dom";
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
  return (
    <div>
      {isSignOutSuccessful &&  <Navigate to="/signin" replace={true} /> }
      <h2>Home</h2>
      <p>Welcome to the Home page!</p>
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  );
}

export default HomePage;