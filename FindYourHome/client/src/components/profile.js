import React, { useState } from "react";
import '../Stylings/profile.css';
import { useNavigate } from 'react-router-dom';
import AccountInfo from "./accountInfo.js";
import MessageList from "./messageList";
import Bookmarks from "./saved_discussions/bookmarks";

export default function Profile() {

    const [tabVal, setTabVal] = useState(() => {
        return parseInt(localStorage.getItem('activeTab')) || 1;
    });

    const navigate = useNavigate();

    const handleTabChange = (index) => {
        setTabVal(index);
        localStorage.setItem('activeTab', index.toString());
        if (index === 2) {
            window.location.reload();
        }
        console.log(index);
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
    
        navigate("/", { state: { loggedOut: true }, replace: true });
    };

    return (
        <div className="container">
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
                <button className="logoutbtn" onClick={() => handleLogout()}>Logout</button>

            </div>
            

            <div className="tabs-block">
                <div onClick={() => handleTabChange(1)} className={`${tabVal === 1 ? 'tab active-tab' : 'tab'}`}> Account Info </div>
                <div className={`${tabVal === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => handleTabChange(2)}> Messages </div>
            </div>

            <div className="contents">
            <div className="bookmarks">
                    <p2><Bookmarks/></p2>
                </div>
                
                <div className={`${tabVal === 1 ? "content active-content" : "content"}`}>
                    <AccountInfo />
                </div>

                <div className={`${tabVal === 2 ? "content active-content" : "content"}`}>
                    <p2><MessageList/></p2>
                </div>
                
            </div>
        </div>
    )
}