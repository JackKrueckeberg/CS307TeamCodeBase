import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";


export default function Twitter(props) {

  return (
    <div>
        <label>Tweets in this area</label>
        <iframe src={"http://localhost:5050/get_tweet/" + props.cityName}></iframe>
    </div>
  );
}
