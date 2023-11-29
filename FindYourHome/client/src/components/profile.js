import React, { useState, useEffect } from "react";
import "../Stylings/profile.css";
import { useUser } from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import AccountInfo from "./accountInfo.js";
import MessageList from "./messageList";
import Bookmarks from "./saved_discussions/bookmarks";
import FavDiscs from "./saved_discussions/favDiscs";
import MessageNotification from "./messageNotification";
import Favorites from "./favorites.js";
import Notifications from "./notifications";
import PageAnimation from "../animations/PageAnimation.jsx";

export default function Profile() {

  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));

  const {user: userProfile } = useUser(); // the id of the current logged in user
  const [user, setInfo] = useState( storedSesUser || storedLocUser || userProfile || initialInfo);

  const g_email = user.email;


    const initialInfo = {
        firstName: '',
        lastName: '',
        profile_image: '',
        bio: '',
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
            const response = await fetch(`http://localhost:5050/profileRoute/profile/${user._id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            if (response.status === 200) {
                const userInfo = await response.json();
                //console.log(userInfo);
                // Update the user state with the fetched data

                setInfo({
                    ...user,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    bio: userInfo.bio,
                })
            }
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

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
        localStorage.setItem('activeTab', index.toString());
        //console.log(index);
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
    
        navigate("/", { state: { loggedOut: true }, replace: true });
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
          <button className="logoutbtn" onClick={() => handleLogout()}>
            Logout
          </button>

                <div>
                    <button className="logoutbtn" onClick={() => handleLogout()}>Logout</button>
                </div>

            </div>

            <div className="profile-page">

            <div className="profile-content">
            <div className="profileCard">
                <div className="profile-image">
                    <img src={`http://localhost:5050/profileRoute/loadImage/${user._id}`} width={150} height={150} alt="Profile" className="circleImage"/>
                </div>
                
                <div className="name">
                    <h2>{user.firstName} {user.lastName}</h2>
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

                <div className="bio">
                    <span placeholder="Tell us about yourself">{user.bio}</span>
                </div>

                <div className="prof-btn">
                <button className="deleteAcct" onClick={() => navigate('/delete-account')}>Delete Account</button>
                </div>
            </div>

            <div className="profile-sections">

            <div className="tabs-block">
                <div onClick={() => handleTabChange(1)} className={`${tabVal === 1 ? 'profile-tab active-tab' : 'profile-tab'}`}> Account Info </div>
                <div className={`${tabVal === 2 ? 'profile-tab active-tab' : 'profile-tab'}`} onClick={() => handleTabChange(2)}> Messages </div>
                <div className={`${tabVal === 3 ? 'profile-tab active-tab' : 'profile-tab'}`} onClick={() => handleTabChange(3)}> Favorites </div>
                <div className={`${tabVal === 4 ? 'profile-tab active-tab' : 'profile-tab'}`} onClick={() => handleTabChange(4)}> Notifications </div>
                <div className={`${tabVal === 5 ? 'profile-tab active-tab' : 'profile-tab'}`} onClick={() => handleTabChange(5)}> My Discussions </div>
            </div>

            <div className="contents">
            {/*<div className="bookmarks">
                <p2><Bookmarks/></p2>
            </div>
            <div className="favorites">
                <p2><FavDiscs/></p2>
    </div>*/}
                
                <div className={`${tabVal === 1 ? "content active-content" : "content"}`}>
                    <AccountInfo />
                </div>

                <div className={`${tabVal === 2 ? "content active-content" : "content"}`}>
                    <MessageList/>
                </div>

                <div className={`${tabVal === 3 ? "content active-content" : "content"}`}>
                    <Favorites/>
                </div>

                <div className={`${tabVal === 4 ? "content active-content" : "content"}`}>
                    <Notifications/>
                </div>

                <div className={`${tabVal === 5 ? "content active-content" : "content"}`}>
                    <div className="disc">
                        <div className="bookmarks">
                            <p2><Bookmarks/></p2>
                        </div>
                        <div className="favorites">
                            <p2><FavDiscs/></p2>
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
