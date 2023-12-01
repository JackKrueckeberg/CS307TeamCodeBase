import React, { useState, useEffect } from "react";
import "../Stylings/profile.css";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import AccountInfo from "./accountInfo.js";
import MessageList from "./messageList";
import Bookmarks from "./saved_discussions/bookmarks";
import FavDiscs from "./saved_discussions/favDiscs";
import MessageNotification from "./messageNotification";
import Favorites from "./favorites.js";
import PageAnimation from "../animations/PageAnimation.jsx";
import Notifications from "./notifications";

const OPENAI_API_KEY = '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'

export default function Profile() {
  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));

  const [favoriteCities, setFavoriteCities] = useState([]);
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [likedCities, setLikedCities] = useState(new Set());
  const [fetchError, setFetchError] = useState(false);

  const [profile_image, setImage] = useState();

  const { user: userProfile } = useUser(); // the id of the current logged in user
  const [user, setInfo] = useState(
    storedSesUser || storedLocUser || userProfile || initialInfo
  );

  const g_email = user.email;

  const initialInfo = {
    firstName: "",
    lastName: "",
    profile_image: "",
    bio: "",
  };

  useEffect(() => {
    // fetch user data from the backend when the component mounts
    const intervalId = setInterval(() => {
      fetchUserInfo();
    }, 3000); // 3000 milliseconds = 3 seconds

    // The cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  // fetch the user data from the backend
  const fetchUserInfo = async () => {
    try {
      //console.log(`This is value of user ${user._id}`);
      const response = await fetch(
        `http://localhost:5050/profileRoute/profile/${user._id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        const userInfo = await response.json();
        //console.log(userInfo);
        // Update the user state with the fetched data

        setInfo({
          ...user,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          bio: userInfo.bio,
        });
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
  };

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

  const clearTopCities = () => {
    setTopCities([]);
  };

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        const response = await fetch(`http://localhost:5050/top_cities/${g_email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch usage stats");
        }
        const data = await response.json();
        setTopCities(getTopThreeCities(data));
        setFetchError(false);
      } catch (error) {
        console.error("Error fetching top cities:", error);
        setFetchError(true);
      }
    };

    fetchUsageStats();
  }, []);

  const clearUsageStats = async () => {
    try {
      const url = `http://localhost:5050/usage_stats/clear_usage/${g_email}`;
      console.log(`Making request to: ${url}`); // Log the URL for debugging
  
      const response = await fetch(url, {
        method: "PATCH",
      });
  
      if (response.ok) {
        console.log('Usage stats cleared');
        setTopCities([]); // Clear top cities from the state as well
      } else {
        console.error(`Failed to clear usage stats: Status ${response.status}`);
        const resText = await response.text();
        console.error(`Response text: ${resText}`);
      }
    } catch (error) {
      console.error("Error clearing usage stats: ", error);
    }
  };

  

  const handleTabChange = (index) => {
    setTabVal(index);
    localStorage.setItem("activeTab", index.toString());
    //console.log(index);
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
      <div className="profile-background">
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
          <div>
            <button className="logoutbtn" onClick={() => navigate("/feedback")}>
              Feedback
            </button>
          </div>
          <button className="logoutbtn" onClick={() => handleLogout()}>
            Logout
          </button>
        </div>

        <div className="profile-page">
          <div className="profile-content">
            <div className="profileCard">
              <div className="profile-image">
                <img
                  src={`http://localhost:5050/profileRoute/loadImage/${user._id}`}
                  width={150}
                  height={150}
                  alt="Profile"
                  className="circleImage"
                />
              </div>

              <div className="name">
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
              </div>

              <div className="bio">
                <span placeholder="Tell us about yourself">{user.bio}</span>
              </div>


              {!fetchError && topCities.length > 0 && (
                <div className="top-cities">
                  <h3>Top Searched Cities</h3>
                  <button onClick={clearTopCities}>Clear Top Cities</button>
                  <ul>
                    {topCities.map((city, index) => (
                      <li key={index}>{`${city[0]}: ${city[1]} searches`}</li>
                    ))}
                  </ul>
                </div>
              )}


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

              <div className="top-cities">
                <h3>Top Searched Cities</h3>
                <ul>
                  {topCities.map((city, index) => (
                    <li key={index}>{`${city[0]}: ${city[1]} searches`}</li>
                  ))}
                </ul>
              </div>

    
              <div className="prof-btn">
                <button
                  className="deleteAcct"
                  onClick={() => navigate("/delete-account")}
                >
                  Delete Account
                </button>
              </div>
            </div>

            <div className="profile-sections">
              <div className="tabs-block">
                <div
                  onClick={() => handleTabChange(1)}
                  className={`${tabVal === 1 ? "profile-tab active-tab" : "profile-tab"
                    }`}
                >
                  {" "}
                  Account Info{" "}
                </div>
                <div
                  className={`${tabVal === 2 ? "profile-tab active-tab" : "profile-tab"
                    }`}
                  onClick={() => handleTabChange(2)}
                >
                  {" "}
                  Messages{" "}
                </div>
                <div
                  className={`${tabVal === 3 ? "profile-tab active-tab" : "profile-tab"
                    }`}
                  onClick={() => handleTabChange(3)}
                >
                  {" "}
                  Favorites{" "}
                </div>
                <div
                  className={`${tabVal === 4 ? "profile-tab active-tab" : "profile-tab"
                    }`}
                  onClick={() => handleTabChange(4)}
                >
                  {" "}
                  Notifications{" "}
                </div>
                <div
                  className={`${tabVal === 5 ? "profile-tab active-tab" : "profile-tab"
                    }`}
                  onClick={() => handleTabChange(5)}
                >
                  {" "}
                  My Discussions{" "}
                </div>
              </div>

              <div className="contents">
                {/*<div className="bookmarks">
                <p2><Bookmarks/></p2>
            </div>
            <div className="favorites">
                <p2><FavDiscs/></p2>
    </div>*/}

                <div
                  className={`${tabVal === 1 ? "content active-content" : "content"
                    }`}
                >
                  <AccountInfo />
                </div>

                <div
                  className={`${tabVal === 2 ? "content active-content" : "content"
                    }`}
                >
                  <MessageList />
                </div>

                <div
                  className={`${tabVal === 3 ? "content active-content" : "content"
                    }`}
                >
                  <Favorites />
                </div>

                <div
                  className={`${tabVal === 4 ? "content active-content" : "content"
                    }`}
                >
                  <Notifications />
                </div>

                <div
                  className={`${tabVal === 5 ? "content active-content" : "content"
                    }`}
                >
                  <div className="disc">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageAnimation>
  );
}
