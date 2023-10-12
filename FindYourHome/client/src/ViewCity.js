import React, { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest'; // Import Autosuggest
import "./Stylings/ViewCity.css";
import { Queue } from "./components/RecentCitiesQueue/RecentCitiesQueue";
import RecentCitiesQueue from "./components/RecentCitiesQueue/RecentCitiesQueue";
import Map, { lat, lon, cityName} from "./components/leaflet/leaflet"
import {CityModel, Model} from "./components/CityModel/CityModel";
const apiKey = "GkImbhMWTdg4r2YHzb7J78I9HVrSTl7zKoAdszfxXfU";


const ViewCity = () => {
    const [allCities, setAllCities] = useState([]);
    const [city, setCity] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [cityIncome, setCityIncome] = useState(null);
    const [cityCoordinates, setCityCoordinates] = useState({ lat: 0, lon: 0 }); // Default coordinates
    const [suggestions, setSuggestions] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [recentCitiesQueue, setRecentCitiesQueue] = useState(new Queue());
    const [cityModel, setCityModel] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:5050/record/cities_full_2`);
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }

                const cities = await response.json();
                setAllCities(cities);
            } catch (error) {
                console.error("There was an error fetching the cities", error);
            }
        }

        fetchData();
    }, []);

    const onSuggestionsFetchRequested = ({ value }) => {
        if (value) {
            const inputValue = value.trim().toLowerCase();
            const matchingCities = allCities.filter((city) =>
                city.name.toLowerCase().startsWith(inputValue)
            );

            setSuggestions(matchingCities.map((city) => city.name).slice(0, 10));
        } else {
            setSuggestions([]);
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const handleSubmit = async () => {
        setShowResults(false);
        const matchedCity = allCities.find((c) => c.name.toLowerCase() === searchTerm.toLowerCase());
        setCity(matchedCity);
        setCityIncome(matchedCity ? matchedCity.median_income : null);
        setCityCoordinates(matchedCity ? {lat: matchedCity.lat, lon: matchedCity.lon}: null)
        if (matchedCity) {
            const img = await searchImage();
            
            const cityModel = new Model(
                matchedCity.name,
                matchedCity.population,
                matchedCity.region,
                matchedCity.state,
                matchedCity.median_income,
                img
            );
            
            setImageUrl(img);
            setCityModel(cityModel);
        }
        setShowResults(true);

    };

    const handleClear = () => {
        setCity(null);
        setShowResults(false);
        setSearchTerm("");
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setIsDropdownOpen(false);
    };

    async function searchImage() {
        const url = `https://api.unsplash.com/search/photos?page=1&query=${searchTerm}&client_id=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const results = data.results;
        return (results[0].urls.small);
    }

    const handleQueueCity = () => {
        // Check if there's a valid city to enqueue
        if (city) {
            // Enqueue the city name to the recent cities queue
            const updatedQueue = recentCitiesQueue.enqueue(city.name);
            setRecentCitiesQueue(updatedQueue);
        } else {
            console.warn("No valid city selected to queue.");
        }
    };

    const renderResults = () => {
        if (showResults && city) {
            return (
                <div className="result">
                    <CityModel model={cityModel} />
                </div>
            );
        } else if (showResults) {
            if (searchTerm === "") {
                return <div className="result"><h2>No City Searched</h2></div>;
            }
            return <div className="result"><h2>Invalid Search</h2></div>;
        }
        return null;
    };

    return (
        <div>
            <h1 className="header">View City Page</h1>

            <div className="searchBar">
                <label>Search</label>
                <Autosuggest // Use Autosuggest component
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={(suggestion) => suggestion}
                    renderSuggestion={(suggestion) => (
                        <div
                            key={suggestion}
                            className="suggestion"
                            onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </div>
                    )}
                    inputProps={{
                        type: "text",
                        placeholder: "Enter a city",
                        value: searchTerm,
                        onChange: handleInputChange,
                    }}
                />
                <button className="submitButton" onClick={handleSubmit}>Submit</button>
                <button className="clearButton" onClick={handleClear}>Clear</button>
                <button className="queueButton" onClick={handleQueueCity}>Add to Queue</button>
            </div>

            <div className="renderResults">
                {renderResults()}
            </div>
            {showResults && (
        <div className="map">
          <Map key={`${cityCoordinates.lat}-${cityCoordinates.lon}`} lat={cityCoordinates.lat} lon={cityCoordinates.lon} />
        </div>
      )}

            <div className="recentlyViewedCities">
                <RecentCitiesQueue queue={recentCitiesQueue} />
            </div>

        </div>
    );
};

export default ViewCity;
