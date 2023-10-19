import React, { useState, useEffect } from "react";
import '../Stylings/profile.css';
import { useNavigate } from 'react-router-dom';
import AccountInfo from "./accountInfo";

export default function Profile() {

    const [tabVal, setTabVal] = useState('1');
    const navigate = useNavigate();

    const handleTabChange = (index) => {
        setTabVal(index);
        console.log(index);
    };

    return (
        <div className="container">
            <div className="nav-buttons">
                <button className="viewCity-button" onClick={() => navigate('/view-city')}>Go to City Search</button>
                <button className="preferences-button" onClick={() => navigate('/preferences')}>Go to Preferences</button>
            </div>
            <div className="tabs-block">
                <div onClick={() => handleTabChange(1)} className={`${tabVal === 1 ? 'tab active-tab' : 'tab'}`}> Account Info </div>
                <div className={`${tabVal === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => handleTabChange(2)}> Messages </div>
            </div>

            <div className="contents">
                
                <div className={`${tabVal === 1 ? "content active-content" : "content"}`}>
                    <AccountInfo/>
                </div>

                <div className={`${tabVal === 2 ? "content active-content" : "content"}`}>
                    
                </div>
            </div>
        </div>
    )
}