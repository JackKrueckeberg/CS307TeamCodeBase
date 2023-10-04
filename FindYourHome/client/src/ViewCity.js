import React, { useState, useEffect } from "react";
import "./Stylings/ViewCity.css";
import { Queue } from "./components/RecentCitiesQueue/RecentCitiesQueue";
import RecentCitiesQueue from "./components/RecentCitiesQueue/RecentCitiesQueue";
const apiKey = "GkImbhMWTdg4r2YHzb7J78I9HVrSTl7zKoAdszfxXfU";

const ViewCity = () => {
  const [allCities, setAllCities] = useState([]);
  const [city, setCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [cityIncome, setCityIncome] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [recentCities, setRecentCities] = useState(new Queue());

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

  const handleSubmit = () => {
    const matchedCity = allCities.find(c => c.name.toLowerCase() === searchTerm.toLowerCase());
    setCity(matchedCity);
    setCityIncome(matchedCity ? matchedCity.median_income : null);
    setShowResults(true);
  };

  const handleClear = () => {
    setCity(null);
    setShowResults(false);
    setSearchTerm("");
  };

  const addToQueue = (city) => {
    setRecentCities(q => q.enqueue(city.name));
    window.alert(recentCities);
  };

  async function searchImage() {
    const url = `https://api.unsplash.com/search/photos?page=1&query=${searchTerm}&client_id=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;
    setImageUrl(results[0].urls.small);
  }

  const renderResults = () => {
    if (showResults && city) {
      if (!imageUrl) searchImage();  // If there isn't an imageUrl, fetch it
      return (
        <div className="result">
          <h2>{city.name}</h2>
          <p>{cityIncome}</p>
          {imageUrl && <img src={imageUrl} alt="City" />}
          <button onClick={()=> addToQueue(city.name)}>Click to add city to queue</button>
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
        <input
          type="text"
          placeholder="Enter a city"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="submitButton" onClick={handleSubmit}>Submit</button>
        <button className="clearButton" onClick={handleClear}>Clear</button>
      </div>

      <div className="renderResults">
        {renderResults()}
      </div>

      <div className="recentlyViewdCities">
        <RecentCitiesQueue queue={recentCities}/>
      </div>

    </div>
  );
};

export default ViewCity;
