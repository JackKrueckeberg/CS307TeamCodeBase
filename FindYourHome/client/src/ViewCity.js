import React, { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest'; // Import Autosuggest
import "./Stylings/ViewCity.css";
import { Queue } from "./components/RecentCitiesQueue/RecentCitiesQueue";
import RecentCitiesQueue from "./components/RecentCitiesQueue/RecentCitiesQueue";
import Map, { lat, lon, cityName } from "./components/leaflet/leaflet"
import { CityModel, Model } from "./components/CityModel/CityModel";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import CityPage from "./components/citypage"
import { useCity } from "./contexts/CityContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const apiKey = "GkImbhMWTdg4r2YHzb7J78I9HVrSTl7zKoAdszfxXfU";

const ViewCity = () => {
    const [allCities, setAllCities] = useState([]);
    const [city, setCity] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [cityName, setCityName] = useState(null);
    const [cityCoordinates, setCityCoordinates] = useState({ lat: 0, lon: 0 }); // Default coordinates
    const [suggestions, setSuggestions] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [recentCitiesQueue, setRecentCitiesQueue] = useState(new Queue());
    const [cityModel, setCityModel] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [shouldFetchAttractions, setShouldFetchAttractions] = useState(false);


    const [favorite, setFavorite] = useState(false)

    const [isVerified, setIsVerified] = useState(false);

    const { user } = useUser();
    const {globalCity, setGlobalCity} = useCity();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
    
        navigate("/", { state: { loggedOut: true }, replace: true });
    };

    useEffect(() => {
        const verificationStatus = localStorage.getItem('isVerified');
        setIsVerified(verificationStatus === 'true');
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


    async function getUser_favorites() {

        const city_info = await fetch("http://localhost:5050/users/user@example.com", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).catch((error) => {
            window.alert(error);
            return;
        });

        const resp = await city_info.json();

        return resp.favorite_cities;
    }


    async function addFavorite(favs) {

        console.log('adding favorite');

        console.log(favs);

        const newFavorite = {
            city: city.name
        }
        favs.push(newFavorite);

        await fetch("http://localhost:5050/favorite_cities/user@example.com", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ favorite_cities: favs })
        }).catch((error) => {
            window.alert(error);
            return;
        });

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
            console.log(data);
    
            // Check if achievement count is above 10
            if (data.count && data.count > 10) {
                // Show the toast notification
                toast.success(`Congrats on reaching ${achievementName}!`);
            }
    
        } catch (error) {
            console.error("Error incrementing achievement:", error);
        }
    };
    
    
    
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
        setCityCoordinates(matchedCity ? { lat: matchedCity.lat, lon: matchedCity.lon } : null)
        if (matchedCity) {
            const img = await searchImage();
            const med_income = matchedCity.median_income ? matchedCity.median_income : "N/A";

            let nation_avg;
            let nation_flag = false;
            if (med_income !== "N/A") {
                nation_avg = med_income - 74580;
                if (nation_avg >= 0) {
                    nation_flag = true;
                }
            }
            const cityModel = new Model(
                matchedCity.name,
                matchedCity.population,
                matchedCity.region,
                matchedCity.state,
                med_income,
                img,
                nation_avg,
                nation_flag,
                matchedCity.lon,
                matchedCity.lat
            );

            incrementAchievement("City-Explorer");
            setImageUrl(img);
            setCityModel(cityModel);
        }
        setGlobalCity(matchedCity);
        setShowResults(true);

    };

    const confirm_fav = async () => {
        if (favorite) {
            const favorite_cities = await getUser_favorites();

            var canAdd = true;

            for (var i = 0; i < favorite_cities.length; i++) {
                if (city.name === favorite_cities[i].cityName) {
                    alert("This search is already favorited.");
                    canAdd = false;
                    break;
                }
            }


            if (canAdd) {
                await addFavorite(favorite_cities);
            }
        }
    }

    const handleClear = () => {
        setCity(null);
        setShowResults(false);
        setSearchTerm("");
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    // const handleSuggestionClick = (suggestion) => {
    //     setSearchTerm(suggestion);
    //     setIsDropdownOpen(false);
    // };

    async function searchImage() {
        const url = `https://api.unsplash.com/search/photos?page=1&query=${searchTerm}&client_id=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const results = data.results;
        return (results[0].urls.small);
    }

    useEffect(() => {
        if (cityModel) {
            handleQueueCity();
        }
    }, [cityModel]);

    const handleQueueCity = () => {
        // Check if there's a valid city to enqueue
        if (cityModel) {
            // Enqueue the city name to the recent cities queue
            const updatedQueue = recentCitiesQueue.enqueue(cityModel);
            setRecentCitiesQueue(updatedQueue);
        } else {
            console.warn("No valid city selected to queue.");
        }
    };

    //allows the submit button to handle the submit and add the city to the queue
    async function handleCombinedActions() {
        await handleSubmit();
        navigate("/citypage");
    }

    const handleVerification = () => {
        navigate("/verification");
    };


    return (
        <div>
            {!isVerified && (
                <div className="verificationBanner">
                    Your account is not verified
                    <button onClick={handleVerification}>Click here to verify</button>
                </div>
            )}
            <h1 className="header">View City Page</h1>
            {showResults && (
                <div>
                    <div>
                        <label>favicon</label>

                        <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite />}
                            defaultChecked={favorite}
                            checked={favorite}
                            className="fav_icon"
                            onChange={(e) => setFavorite(!favorite)}
                        />
                    </div>
                    <button className="confirmButton" onClick={confirm_fav}>Confirm favorite</button>
                </div>
            )}

            <div className="container">

                {showResults && city && <CityPage showResults={showResults} city={city} cityModel={cityModel} cityCoordinates={cityCoordinates} testProp="Test"></CityPage>}


                {showResults && !city &&
                    <div className="errorMessage">
                        {searchTerm === "" ? <h2>No City Searched</h2> : <h2>Invalid Search</h2>}
                    </div>
                }

                <div className="mainContent">
                    <div className="searchBar">
                        <label htmlFor="city-input">Search</label>
                        <Autosuggest // Use Autosuggest component
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={(suggestion) => suggestion}
                            renderSuggestion={(suggestion) => (
                                <div
                                    key={suggestion}
                                    className="suggestion"
                                >
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
                        <div className="button-group">
                            <button className="submitButton" onClick={handleCombinedActions}>Submit</button>
                            <button className="clearButton" onClick={handleClear}>Clear</button>
                        </div>


                    </div>
                </div>

                <button className="advancedSearch" onClick={() => navigate("/preferences")}>Advanced Search</button>
                <button className="profilebtn" onClick={() => navigate("/profile")}>Profile</button>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </div>

            <div className="recentlyViewedCities">
                <RecentCitiesQueue queue={recentCitiesQueue} />
            </div>

            <ToastContainer />
        </div>

    );
};

export default ViewCity;