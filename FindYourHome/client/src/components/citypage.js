import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";
//import "../Stylings/citypage.css";
import Map, { lat, lon, cityName } from "./leaflet/leaflet";
import { CityModel, Model } from "./CityModel/CityModel";
import Twitter from "./twitter";
import { useCity } from "../contexts/CityContext";

const OPENAI_API_KEY = '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'

export default function CityPage(props) {
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState('');
  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));


  // Parsing the cityModel from localStorage
  const cityModelStored = localStorage.getItem('selectedCity');
  const cityModel = cityModelStored ? JSON.parse(cityModelStored) : {};
  console.log(cityModel);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');

    navigate("/", { state: { loggedOut: true }, replace: true });
  };

  // useEffect(() => {
  //   async function fetchAttractions(city) {
  //     try {
  //       const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${OPENAI_API_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           model: 'gpt-3.5-turbo',
  //           messages: [{ role: 'user', content: `top 10 attractions in ${city}` }],
  //           temperature: 1.0,
  //           top_p: 0.7,
  //           n: 1,
  //           stream: false,
  //           presence_penalty: 0,
  //           frequency_penalty: 0,
  //         }),
  //       });

  useEffect(() => {
    async function fetchAttractions(city) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `top 10 attractions in ${city}` }],
            temperature: 1.0,
            top_p: 0.7,
            n: 1,
            stream: false,
            presence_penalty: 0,
            frequency_penalty: 0,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // console.log(data.choices[0].message.content);
          setApiResponse(data.choices[0].message.content);  // Set the fetched data to the state
        } else {
          console.log('Error: Unable to process your request.');
        }
      } catch (error) {
        console.error(error);
        console.log('Error: Unable to process your request.');
      }
    }

    if (cityModel.name) {
      fetchAttractions(cityModel.name);
    }
  }, [cityModel.name]);


  return (
    <div className="root">
      <div className="navBar">

        <div class="profiletooltip">
          <button className="profilebtn" onClick={() => navigate("/profile")}>Profile</button>
          <span class="profiletooltiptext">View your profile page and make edits</span>
        </div>
        <div class="profiletooltip">
          <button className="profilebtn" onClick={() => navigate("/view-city")}>City Search</button>
          <span class="profiletooltiptext">Search for cities by name</span>
        </div>
        <div class="advancedtooltip">
          <button className="advancedSearch" onClick={() => navigate("/preferences")}>Advanced Search</button>
          <span class="advancedtooltiptext">Search based on attributes of cities</span>
        </div>
        <div class="discussiontooltip">
          <button className="discussionButton" onClick={() => navigate("/discussionHome")}>Discussions</button>
          <span class="discussiontooltiptext">View discussions about different cities</span>
        </div>
        <button className="logoutbtn" onClick={() => handleLogout()}>Logout</button>
      </div>
      <div>
    <button onClick={() => navigate("/properties", { city: cityModel.name })}>
      View Properties in {cityModel.name}
    </button>
  </div>
      <div className="result">
        {cityModel.name && <CityModel model={cityModel} />}
        {cityModel.name && (
          <div className="mapContainer">
            <Map key={`${cityModel.lat}-${cityModel.lon}`} lat={cityModel.lat} lon={cityModel.lon} />
          </div>
        )}
      </div>
      <div className="attractions">
        <h3>Top 10 City Attractions: (takes a second to load)</h3>
        <p>{apiResponse}</p>  {/* Render the response */}
      </div>
      {/* You might want to replace globalCity.name with cityModel.name below if you're no longer using globalCity */}
      <Twitter cityName={cityModel.name}></Twitter>
    </div>
  );
}



