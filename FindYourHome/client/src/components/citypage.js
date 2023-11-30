import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";
//import "../Stylings/citypage.css";
import Map, { lat, lon, cityName } from "./leaflet/leaflet";
import { CityModel, Model } from "./CityModel/CityModel";
import Twitter from "./twitter";
import { useCity } from "../contexts/CityContext";
import { useLocalStorage } from "@uidotdev/usehooks";
import BreadcrumbTrails from "./breadcrumbTrails";

const OPENAI_API_KEY = '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'

export default function CityPage(props) {
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));

  const [attrationsLoc, setAttractionsLoc] = useLocalStorage("attractions-loc", {});

  function updateAttractionsLoc(value) {
    return setAttractionsLoc((prev) => {
      return { ...prev, ...value };
    });
  }

  console.log(attrationsLoc);


  // Parsing the cityModel from localStorage
  const cityModelStored = localStorage.getItem('selectedCity');
  const cityModel = cityModelStored ? JSON.parse(cityModelStored) : {};
  // console.log(cityModel);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');

    navigate("/", { state: { loggedOut: true }, replace: true });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };


  const fetchAddedData = async () => {
    if (!searchTerm) {
      setErrorMessage("Please enter a search term."); // Set error message if search term is empty
      return;
    }
    setErrorMessage('');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `${searchTerm} in ${cityModel.name}` }],
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
        setExtraInfo(data.choices[0].message.content);
        setSearchTerm(''); // Clear the search term after fetching data
      } else {
        console.log('Error: Unable to process your request.');
        setExtraInfo('Error: Unable to process your request.');
      }
    } catch (error) {
      console.error(error);
      console.log('Error: Unable to process your request.');
      setExtraInfo('Error: Unable to process your request.');
    }
  };



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
          updateAttractionsLoc( {
            [cityModel.name]: data.choices[0].message.content
          })
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

        <div className="breadcrumb"> <BreadcrumbTrails/></div>

        {cityModel.name && <CityModel model={cityModel} />}
        {cityModel.name && (
          <div className="mapContainer">
            <Map key={`${cityModel.lat}-${cityModel.lon}`} lat={cityModel.lat} lon={cityModel.lon} />
          </div>
        )}
      </div>
      <div className="attractions">
        <h3>Top 10 City Attractions: (takes a second to load)</h3>
        <p>{attrationsLoc[cityModel.name]}</p>  {/* Render the response */}
      </div>

      <button onClick={toggleSearchBar}>
                {isSearchBarVisible ? 'Hide Search Bar' : 'Show Search Bar'}
            </button>

      {isSearchBarVisible && (
      <div className="dataBar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for anything..."
        />
        <button onClick={fetchAddedData}>Search</button> {/* Fetch data on button click */}
      </div>
      )}
      
      {/* Display error message if present */}
      {errorMessage && (
        <div className="errorMessage">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Display the extraInfo if available */}
      {extraInfo && (
        <div className="extraInfo">
          <h3>Search Results:</h3>
          <p>{extraInfo}</p>
        </div>
      )}

      {/* You might want to replace globalCity.name with cityModel.name below if you're no longer using globalCity */}
      <Twitter cityName={cityModel.name}></Twitter>
    </div>

  );
}



