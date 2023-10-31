import React from "react";
import { CityModel } from "./CityModel/CityModel";
import { useNavigate } from "react-router-dom";
//import "../Stylings/compareCities.css";

export default function CompareCities() {
    // Retrieve cities from localStorage
    const citiesToCompare = JSON.parse(localStorage.getItem('compareCities') || '[]');
    const navigate = useNavigate();

    function handleBackButton() {
        localStorage.removeItem('compareCities');
        navigate("/view-city");
    }
    
    return (
        <div>
            <h1>Compare Cities</h1>
            {/* Wrap the city details in a flex container */}
            <div className="compare-container">
                {citiesToCompare.map((city, index) => (
                    // Wrap each CityModel with a city-box class
                    <div key={index} className="city-box">
                        <CityModel model={city} />
                    </div>
                ))}
            </div>

            <div>
                <button onClick={handleBackButton}>Back to View City</button>
            </div>
        </div>
    );
}
