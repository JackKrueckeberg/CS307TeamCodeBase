import React, { useState, useEffect } from "react";
import "../Stylings/profile.css";
import { useNavigate } from "react-router-dom";
import AccountInfo from "./accountInfo.js";
import MessageList from "./messageList";
import Bookmarks from "./saved_discussions/bookmarks";
import FavDiscs from "./saved_discussions/favDiscs";
import MessageNotification from "./messageNotification";
import Favorites from "./favorites.js";
import PageAnimation from "../animations/PageAnimation.jsx";
import { useUser } from "../contexts/UserContext";
const OPENAI_API_KEY = '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'

export default function Profile() {
  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [likedCities, setLikedCities] = useState(new Set());

  const { user: userProfile } = useUser(); // the id of the current logged in user
  const [user, setInfo] = useState(
    storedSesUser || storedLocUser || userProfile
  );

  const g_email = user.email;

  const [tabVal, setTabVal] = useState(() => {
    return parseInt(localStorage.getItem("activeTab")) || 1;
  });

  const navigate = useNavigate();
  const [topCities, setTopCities] = useState([]);


  // Define the getTopThreeCities function
  const getTopThreeCities = (usageStats) => {
    const citiesArray = Object.entries(usageStats);
    citiesArray.sort((a, b) => b[1] - a[1]);
    return citiesArray.slice(0, 3);
  };

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        const response = await fetch(`http://localhost:5050/top_cities/${g_email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch usage stats');
        }
        const data = await response.json();
        setTopCities(getTopThreeCities(data));
      } catch (error) {
        console.error("Error fetching top cities:", error);
      }
    };

    fetchUsageStats();
  }, []);

  const handleTabChange = (index) => {
    setTabVal(index);
    localStorage.setItem("activeTab", index.toString());
    if (index === 2) {
      window.location.reload();
    }
    console.log(index);
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");

    navigate("/", { state: { loggedOut: true }, replace: true });
  };


  // Fetch Favorite Cities
  useEffect(() => {
    const fetchFavoriteCities = async () => {
      try {
        const response = await fetch(`http://localhost:5050/favorite_cities/${g_email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorite cities');
        }
        const data = await response.json();
        setFavoriteCities(data);
      } catch (error) {
        console.error("Error fetching favorite cities:", error);
      }
    };

    fetchFavoriteCities();
  }, [g_email]);

  // Fetch Suggested Cities
  useEffect(() => {
    favoriteCities.forEach(city => {
      fetchSuggestedCities(city);
    });
  }, [favoriteCities]);

  async function fetchSuggestedCities(city) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `What is one city similar to ${city}? Only give the name of the city.` }],
          temperature: 0.7,
          top_p: 1,
          n: 1,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateSuggestedCities(data.choices[0].message.content.trim());
      } else {
        console.log('Error: Unable to process your request.');
      }
    } catch (error) {
      console.error(error);
      console.log('Error: Unable to process your request.');
    }
  }

  function updateSuggestedCities(suggestedCity) {
    if (suggestedCity && !suggestedCities.includes(suggestedCity)) {
      setSuggestedCities(prevList => [...prevList, suggestedCity]);
    }
  }

  const handleLike = (cityToLike) => {
    setLikedCities(prevLikedCities => new Set(prevLikedCities.add(cityToLike)));
  };

  // Function to handle disliking a city
  const handleDislike = (cityToDislike) => {
    setSuggestedCities(prevList => prevList.filter(city => city !== cityToDislike));
    setLikedCities(prevLikedCities => {
      const newLikedCities = new Set(prevLikedCities);
      newLikedCities.delete(cityToDislike);
      return newLikedCities;
    });
  };

  // Clear Suggested Cities
  const clearSuggestedCities = () => {
    setSuggestedCities([]);
    setLikedCities(new Set()); // Also clear the liked cities state
  };


  return (
    <PageAnimation>
      <div className="container">
        <div>
          <MessageNotification />
        </div>
        <div className="navBar">
          <div class="profiletooltip">
            <button
              className="profilebtn"
              onClick={() => navigate("/view-city")}
            >
              City Search
            </button>
            <span class="profiletooltiptext">Search for cities by name</span>
          </div>
          <div class="advancedtooltip">
            <button
              className="advancedSearch"
              onClick={() => navigate("/preferences")}
            >
              Advanced Search
            </button>
            <span class="advancedtooltiptext">
              Search based on attributes of cities
            </span>
          </div>
          <div class="discussiontooltip">
            <button
              className="discussionButton"
              onClick={() => navigate("/discussionHome")}
            >
              Discussions
            </button>
            <span class="discussiontooltiptext">
              View discussions about different cities
            </span>
          </div>
          <button className="logoutbtn" onClick={() => handleLogout()}>
            Logout
          </button>

          <div>
            <button
              className="logoutbtn"
              onClick={() => navigate("/delete-account")}
            >
              Delete Account
            </button>
          </div>
        </div>

        <div className="tabs-block">
          <div
            onClick={() => handleTabChange(1)}
            className={`${tabVal === 1 ? "tab active-tab" : "tab"}`}
          >
            {" "}
            Account Info{" "}
          </div>
          <div
            className={`${tabVal === 2 ? "tab active-tab" : "tab"}`}
            onClick={() => handleTabChange(2)}
          >
            {" "}
            Messages{" "}
          </div>
        </div>

        <div className="contents">
          <div className="bookmarks">
            <p2>
              <Bookmarks />
            </p2>
          </div>
          <div className="favorites">
            <p2>
              <FavDiscs />
            </p2>
          </div>

          <div
            className={`${tabVal === 1 ? "content active-content" : "content"}`}
          >
            <AccountInfo />
          </div>

          <div className="top-cities">
            <h3>Top Searched Cities</h3>
            <ul>
              {topCities.map((city, index) => (
                <li key={index}>{`${city[1]} searches`}</li>
              ))}
            </ul>
          </div>

          <div>
      <h2>Suggested Cities</h2>
      <button onClick={clearSuggestedCities}>Clear All</button>
      {suggestedCities.length > 0 ? (
        <ul>
          {suggestedCities.map((city, index) => (
            <li key={index}>
              {city}
              {!likedCities.has(city) && (
                <>
                  <button onClick={() => handleLike(city)}>Like</button>
                  <button onClick={() => handleDislike(city)}>Dislike</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No suggested cities available.</p>
      )}
    </div>


          <div
            className={`${tabVal === 2 ? "content active-content" : "content"}`}
          >
            <p2>
              <MessageList />
            </p2>
          </div>
        </div>
      </div>
    </PageAnimation>
  );
}
