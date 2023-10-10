import React, { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest'; // Import Autosuggest
import "./ViewCity.css";


const ViewCity = () => {
  const [allCities, setAllCities] = useState([]);
  const [city, setCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [cityIncome, setCityIncome] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);



  const [recentSearches, setRecentSearches] = useState([]);
  const [mockUser, setMockUSer] = useState({
    username: "example_user",
    password: "example_password",
    email: "user@example.com",
    favorites: [],
    recent_cities: [],
    recent_searches: [],
  });

  useEffect(() => {
    async function fetchCity() {
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

    fetchCity();


    async function fetchUser() {
      try {
        const response = await fetch(`http://localhost:5050/record/users`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const users = await response.json();
        console.log(users)
      } catch (error) {
        console.error("There was an error fetching the cities", error);
      }
    }

    fetchUser();


    setRecentSearches(mockUser.recent_searches);
  }, [mockUser]);




  const updateRecentSearches = (searchTerm) => {
    // Update the recent_searches field of the mock user
    mockUser.recent_searches.push(searchTerm);
    setRecentSearches([...mockUser.recent_searches]);
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

  const handleSubmit = () => {
    const matchedCity = allCities.find((c) => c.name.toLowerCase() === searchTerm.toLowerCase());
    setCity(matchedCity);
    setCityIncome(matchedCity ? matchedCity.median_income : null);
    setShowResults(true);
    updateRecentSearches(searchTerm);

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

  const renderResults = () => {
    
    
    
    
    if (showResults && city) {
      return (
        <div className="result">
          <h2>{city.name}</h2>
          <p>{cityIncome}</p>
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


  const renderRecentSearches = () => {
    if (recentSearches.length === 0) {
      return <div className="recent-searches">No recent searches</div>;
    }

    return (
      <div className="recent-searches">
        <h3>Recent Searches:</h3>
        <ul>
          {recentSearches.map((search, index) => (
            <li key={index}>{search}</li>
          ))}
        </ul>
      </div>
    );
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
              onClick={() => handleSuggestionClick(suggestion)}
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
        <button className="submitButton" onClick={handleSubmit}>Submit</button>
        <button className="clearButton" onClick={handleClear}>Clear</button>
      </div>

      <div className="renderResults">
        {renderResults()}
      </div>
      {renderRecentSearches()}

    </div>
  );
};

export default ViewCity;

















