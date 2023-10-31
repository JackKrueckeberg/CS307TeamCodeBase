import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";
import "../Stylings/ViewCity.css";
import { useUser } from '../contexts/UserContext';


export default function DeleteAccount() {


  const {user: userProfile } = useUser(); // the id of the current logged in user

  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");


  async function deleteAccount() {

    await fetch("http://localhost:5050/profileRoute/" + userProfile._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      window.alert(error);
      return;
    });

    navigate("/createAccount");

    
  }

  async function handleDelete() {
    if (username === confirm && username === userProfile.email) {
        console.log("deleting account");
        console.log(userProfile._id);
        deleteAccount();
    } else {
        alert("Could not delete account. Incorrect email or confirm.");
    }



  }


  const navigate = useNavigate();
  

  return (
    <div>
        <button className="preferences-button" onClick={() => navigate('/profile')}>Cancel</button>
        <br></br>
        <label>Are you sure you want to delete your account?</label>
        <br></br>
        <label>Enter your email to confirm deletion.</label>
        <p>Upon deleting your account, all preferences and information will be deleted. Press cancel if you are not sure.</p>
        <br></br>
        <input placeholder="email" onChange={(e) => setUsername(e.target.value)}></input>
        <br></br>
        <br></br>
        <input placeholder="confirm email" onChange={(e) => setConfirm(e.target.value)}></input>
        <br></br>
        <br></br>
        <button className="logout" onClick={() => handleDelete()}>Delete Account</button>
    </div>
    
  );
}
