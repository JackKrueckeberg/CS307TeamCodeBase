import React, { useState, useEffect } from "react";
import "./ViewCity.css";

const ViewCity = () => {
  const [allCities, setAllCities] = useState([]);
  const [city, setCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

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
    setShowResults(true);
  };

  const handleClear = () => {
    setCity(null);
    setShowResults(false);
    setSearchTerm("");
  };

  const renderResults = () => {
    console.log(city);
    if (showResults && city) {
      return (
        <div className="result">
          <h2>{city.name}</h2>
          <p>{city.country}</p>
        </div>
      );
    } else if (showResults) {
      return <div className="result"><h2>Invalid Search</h2></div>;
    }
    return null;
  }

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

    </div>
  );
};

export default ViewCity;
