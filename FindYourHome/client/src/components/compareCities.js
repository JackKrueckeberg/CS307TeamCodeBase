import React from "react";
import { CityModel, Model } from "./CityModel/CityModel";
import { useNavigate } from "react-router-dom";

export default function CompareCities() {
    // Retrieve cities from localStorage
    const citiesToCompare = JSON.parse(localStorage.getItem('compareCities') || '[]');
    console.log(citiesToCompare);
    const navigate = useNavigate();

    function handleBackButton() {
        localStorage.removeItem('compareCities');
        navigate("/view-city");
    }
    return (
        <div>
            <div>
                <button onClick={handleBackButton}>Back to View City</button>
            </div>
        </div>
    );
}
