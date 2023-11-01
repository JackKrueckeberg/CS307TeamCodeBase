import React from "react";
import { CityModel } from "./CityModel/CityModel";
import { useNavigate } from "react-router-dom";
import "../Stylings/compareCities.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompareCities() {
    // Retrieve cities from localStorage
    const citiesToCompare = JSON.parse(localStorage.getItem('compareCities') || '[]');
    const navigate = useNavigate();

    function handleBackButton() {
        localStorage.removeItem('compareCities');
        incrementAchievement("The-Judge");
        navigate("/view-city");
    }

    const incrementAchievement = async (achievementName) => {
        try {
            const userEmail = "user2@example.com"; // Replace with the correct email

            const response = await fetch(`http://localhost:5050/achievements/${userEmail}/${achievementName}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: "incrementAchievement"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Check if achievement count is above 10
            if (data.count && data.count === 10) {
                // Show the toast notification
                toast.success(`Congrats on reaching ${achievementName}!`);
            }

        } catch (error) {
            console.error("Error incrementing achievement:", error);
        }
    };

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

                <ToastContainer />
            </div>

            <div>
                <button onClick={handleBackButton}>Back to View City</button>
            </div>
        </div>
    );
}
