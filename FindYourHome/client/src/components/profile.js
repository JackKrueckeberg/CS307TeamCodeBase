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

export default function Profile() {
  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));

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
            <li key={index}>{`${city[0]}: ${city[1]} searches`}</li>
          ))}
        </ul>
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
