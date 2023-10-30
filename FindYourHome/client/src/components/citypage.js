import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";
import Map, { lat, lon, cityName } from "./leaflet/leaflet";
import { CityModel, Model } from "./CityModel/CityModel";
import "../Stylings/ViewCity.css";
import Twitter from "./twitter";
import { useCity } from "../contexts/CityContext";
const OPENAI_API_KEY = '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'

export default function CityPage(props) {
  const currentUser = localStorage.getItem("currentCity");
  const { city: globalCity } = useCity();
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState('');

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

    if (globalCity.name) {
      fetchAttractions(globalCity.name);
    }
  }, [globalCity.name]);


  return (
    <div>
      <div className="nav-buttons">
        <button className="viewCity-button" onClick={() => navigate('/view-city')}>Go to City Search</button>
        <button className="preferences-button" onClick={() => navigate('/preferences')}>Go to Preferences</button>
      </div>
      <div className="result">
        <label content={globalCity.lon}></label>
        {globalCity.name && globalCity && <CityModel model={globalCity} />}
        {globalCity.name && globalCity && <Map key={`${globalCity.lat}-${globalCity.lon}`} lat={globalCity.lat} lon={globalCity.lon} />}
      </div>
      <div>
        <h3>Top 10 City Attractions: (takes a second to load)</h3>
        <p>{apiResponse}</p>  {/* Render the response */}
      </div>
      <Twitter cityName={globalCity.name}></Twitter>
      {/* Display fetched attractions if available (you can customize this part) */}
    </div>
  );
}


