import React from "react";
import { CityModel } from "./CityModel/CityModel";
import { useNavigate } from "react-router-dom";

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
            {/* Display city details */}
            {citiesToCompare.map((city, index) => (
                <CityModel key={index} model={city} />
            ))}

            <div>
                <button onClick={handleBackButton}>Back to View City</button>
            </div>
        </div>
    );
}
