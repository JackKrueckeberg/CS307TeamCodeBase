import React, { useState, useEffect } from "react";
import '../Stylings/profile.css';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import AccountInfo from "./accountInfo.js";
import MessageList from "./messageList";
import Bookmarks from "./saved_discussions/bookmarks";
import FavDiscs from "./saved_discussions/favDiscs";
import MessageNotification from "./messageNotification";
import Favorites from "./favorites.js";
import defaultImage from '../Stylings/Default_Profile_Picture.png';
import Notifications from "./notifications";

export default function Profile() {

    const initialInfo = {
        firstName: '',
        lastName: '',
        profile_image: '',
    };

    const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const storedLocUser = JSON.parse(localStorage.getItem('currentUser'));
    const [profile_image, setImage] = useState(defaultImage);

    const {user: userProfile } = useUser(); // the id of the current logged in user
    const [user, setInfo] = useState( storedSesUser || storedLocUser || userProfile || initialInfo);

    useEffect(() => {
        // fetch user data from the backend when the component mounts
        const intervalId = setInterval(() => {
            fetchUserInfo();

          }, 5000); // 5000 milliseconds = 5 seconds
      
          // The cleanup function to clear the interval when the component unmounts
          return () => {
            clearInterval(intervalId);
          };
    }, []);
    // fetch the user data from the backend
    const fetchUserInfo = async () => {
        try {

            console.log(`This is value of user ${user._id}`);
            const response = await fetch(`http://localhost:5050/profileRoute/profile/${user._id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            if (response.status === 200) {
                const userInfo = await response.json();
                console.log(userInfo);
                // Update the user state with the fetched data
                if (userInfo.profile_image === "") {
                    setImage(defaultImage);
                    setInfo({
                        ...user,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        profile_image: defaultImage,
                        bio: userInfo.bio,
                    });
                } else {
                    setInfo({
                        ...user,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        profile_image: userInfo.profile_image,
                        bio: userInfo.bio,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }



    const [tabVal, setTabVal] = useState(() => {
        return parseInt(localStorage.getItem('activeTab')) || 1;
    });

    const navigate = useNavigate();

    const handleTabChange = (index) => {
        setTabVal(index);
        localStorage.setItem('activeTab', index.toString());
        console.log(index);
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
    
        navigate("/", { state: { loggedOut: true }, replace: true });
    };

    return (
        <div className="profile-background">
        
            <div><MessageNotification /></div>
            <div className="navBar">
                
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

                <div>
                    <button className="logoutbtn" onClick={() => handleLogout()}>Logout</button>
                </div>

            </div>

            <div className="profile-page">

            <div className="profile-content">
            <div className="profileCard">
                <div className="profile-image">
                    <img src={profile_image} width={150} height={150} alt="Profile"/>
                </div>
                
                <div className="name">
                    <h2>{user.firstName} {user.lastName}</h2>
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
                
            </div>
            </div>
            </div>
        </div>
        </div>
    )
}