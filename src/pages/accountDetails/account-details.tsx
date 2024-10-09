import "./account-details.css";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  User,
} from "firebase/auth";
import { UserAccount } from "../../models/shared";
import { Link, useNavigate } from "react-router-dom";

function AccountDetails() {
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // To hold the current password for re-authentication
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const navigate = useNavigate();

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, retrieve their info
        setFirebaseUser(user);
      } else {
        // User is signed out or not logged in
        console.log("User is not logged in");
        setFirebaseUser(null); // Optional: Reset user state when logged out
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (firebaseUser) {
      const username = firebaseUser.email
        ? firebaseUser.email.split("@")[0]
        : ""; // Fallback value if email is null or undefined
      setCurrentUsername(username);
    }
  }, [firebaseUser]); // This will trigger when firebaseUser changes

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const reauthenticate = async (currentPassword) => {
    if (firebaseUser) {
      const credential = EmailAuthProvider.credential(
        firebaseUser.email ? firebaseUser.email : "",
        currentPassword
      );

      try {
        await reauthenticateWithCredential(firebaseUser, credential);
        return true;
      } catch (error) {
        setErrorMessage("Re-authentication failed: " + error.message);
        return false;
      }
    }
  };

  const updateAccount = async (event) => {
    event.preventDefault();

    if (firebaseUser) {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      if (await reauthenticate(currentPassword)) {
        const userEmail = newUsername.trim() + "@email.com";

        try {
          // 1. Retrieve the user account data from Firestore
          const userAccount = await UserAccount.getUserByUuid(firebaseUser.uid);

          // 2. Update username and Firestore document if username has changed
          if (newUsername && newUsername !== currentUsername) {
            // Update the user's email in Firebase Auth
            await updateEmail(firebaseUser, userEmail);

            // Update the Firestore document to change the docId
            await UserAccount.updateUserName(userAccount, userEmail); // Pass the new username to update

            // Update the current username state
            setCurrentUsername(newUsername);
          }

          // Update password if provided
          if (password) {
            await updatePassword(firebaseUser, password);
          }

          setErrorMessage("");
          alert("Account details have been successfully updated.");

          // Clear the input fields
          setNewUsername("");
          setPassword("");
          setConfirmPassword("");
          setCurrentPassword("");
        } catch (error) {
          setErrorMessage("Update failed: " + error.message);
        }
      }
    }
  };

  const deleteAccount = async () => {
    if (firebaseUser) {
      if (
        window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      ) {
        if (await reauthenticate(currentPassword)) {
          try {
            const userAccount = await UserAccount.getUserByUuid(
              firebaseUser.uid
            );
            await UserAccount.deleteUser(userAccount);
            await deleteUser(firebaseUser);
            alert("Account has been successfully deleted.");
            navigate("/signup"); // Redirect to the signup page or another appropriate page
          } catch (error) {
            setErrorMessage("Account deletion failed: " + error.message);
          }
        }
      }
    }
  };

  // Front End Section
  return (
    <div className="wrapper-ad">
      {isUpdated}
      <h1>Account Details</h1>
      <form onSubmit={updateAccount}>
        <div className="heading-2">
          <strong>Current Username:</strong>{" "}
          <span style={{ fontWeight: "lighter" }}>{currentUsername}</span>
        </div>
        <div className="input-box-ad">
          <div className="heading-3"> Confirm Current Password:</div>
          <input
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
          ></input>
        </div>
        <div className="input-box-ad">
          <div className="heading-3" style={{ paddingRight: "7px" }}>
            {" "}
            New Username (Optional):
          </div>
          <input
            type="text"
            value={newUsername}
            onChange={handleUsernameChange}
          ></input>
        </div>
        <div className="input-box-ad">
          <div className="heading-3" style={{ paddingRight: "11px" }}>
            {" "}
            New Password (Optional):
          </div>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          ></input>
        </div>
        <div className="input-box-ad">
          <div className="heading-3" style={{ paddingRight: "30px" }}>
            {" "}
            Confirm New Password:
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          ></input>
        </div>
        <div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button
            disabled={
              currentPassword === "" ||
              (currentPassword === "" && newUsername === "") ||
              (currentPassword === "" &&
                password === "" &&
                confirmPassword === "")
            }
          >
            Update Details
          </button>
        </div>
      </form>
      <button className="delete-account-button" onClick={deleteAccount}>
        Delete Account
      </button>
      <Link to="/home">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

export default AccountDetails;
