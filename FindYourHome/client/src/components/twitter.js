import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";


export default function Twitter() {

    async function get_tweet() {
        return await fetch("http://localhost:5050/users/user@example.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: "city"
          }).catch((error) => {
            window.alert(error);
            return;
          });
    }

  return (
    <div>
        <label>Tweets in this area</label>
        <iframe src={"http://localhost:5050/get_tweet/denver"}></iframe>
    </div>
  );
}
