import React, { useState } from "react";
import '../Stylings/profile.css';
import { useNavigate } from 'react-router-dom';
import AccountInfo from "./accountInfo.js";
import MessageList from "./messageList";

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
                <button className="viewCity-button" onClick={() => navigate('/view-city')}>Go to City Search</button>
                <button className="preferences-button" onClick={() => navigate('/preferences')}>Go to Preferences</button>
                <button className="profilebtn" onClick={() => navigate("/discussionHome")}>Discussions</button>
                <button className="logout" onClick={handleLogout}>Logout</button>
                <button className="logout" onClick={() => navigate('/delete-account')}>Delete Account</button>
            </div>
            <div className="tabs-block">
                <div onClick={() => handleTabChange(1)} className={`${tabVal === 1 ? 'tab active-tab' : 'tab'}`}> Account Info </div>
                <div className={`${tabVal === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => handleTabChange(2)}> Messages </div>
            </div>

            <div className="contents">
                
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