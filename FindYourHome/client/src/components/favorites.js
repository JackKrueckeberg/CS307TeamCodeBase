import React, { useState } from "react";
import './Stylings/favorites.css';

export default function Favorites() {
    
    const [state, setState] = useState(1);

    const action = (index) => {
        setState(index)
        console.log(index);
    }

    return (
        <div className="container">
            <div className="tabs-block">
                <div onClick={() => action(1)} className={`${state === 1 ? 'tab active-tab' : 'tab'}`}> Favorite Cities </div>
                <div className={`${state === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => action(2)}> Favorite Searches </div>
            </div>

            <div className="contents">
                <div className={`${state === 1 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Cities </h2>
                    <p> Insert city favorites list here</p>
                </div>

                <div className={`${state === 2 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Searches </h2>
                    <p> Insert search favorites list here </p>
                </div>
            </div>
        </div>
    )
}