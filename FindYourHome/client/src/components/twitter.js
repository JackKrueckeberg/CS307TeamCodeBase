import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";


export default function Twitter(props) {

  function refresh() {
    document.getElementById('iframe').src = document.getElementById('iframe').src
  }

  return (
    <div>
        <label>Tweets in this area</label>
        <button onClick={() => (refresh())}>refresh</button>
        <br></br>
        <iframe src={"http://localhost:5050/get_tweet/" + props.cityName} id="iframe"></iframe>
    </div>
  );
}
