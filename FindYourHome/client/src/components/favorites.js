import React, { useState } from "react";
import '../Stylings/favorites.css';

export default function Favorites() {
    
    const [tabVal, setTabVal] = useState(1); // tabVal remembers which tabs are active

    const handleTabChange = (index) => {
        setTabVal(index) // sets the state to whatever index the tab is
        console.log(index);
    }

    return (
        <div className="container">
            <div className="tabs-block">
                <div onClick={() => handleTabChange(1)} className={`${tabVal === 1 ? 'tab active-tab' : 'tab'}`}> Favorite Cities </div>
                <div className={`${tabVal === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => handleTabChange(2)}> Favorite Searches </div>
            </div>

            <div className="contents">
                <div className={`${tabVal === 1 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Cities </h2>
                    <p> Insert city favorites list here</p>
                </div>

                <div className={`${tabVal === 2 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Searches </h2>
                    <p> Insert search favorites list here </p>
                </div>
            </div>
        </div>
    )
}