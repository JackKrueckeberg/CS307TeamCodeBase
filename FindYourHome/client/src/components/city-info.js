import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { CityModel } from "./CityModel/CityModel";


export default function City_Info(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const cityModel = location.state.model;

    // URL to your server-side endpoint which queries Google Places
    const serverUrl = "http://localhost:5050/getAttractions";

    function queryCityAttractions(cityName) {
        return fetch(`${serverUrl}?cityName=${cityName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        });
    }

    useEffect(() => {
        const cityName = cityModel.name;
        queryCityAttractions(cityName)
            .then(data => {
                console.log(data);
                // Here, data.results will contain the list of attractions
            })
            .catch(error => {
                console.error("There was an error:", error);
            });
    }, []);  // Empty dependency array ensures the effect runs only once

    return (
        <div>
            {/* Render your component data here */}
        </div>
    );
}
