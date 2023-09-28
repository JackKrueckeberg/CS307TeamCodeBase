// src/components/user/User.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const User = () => {
  // Sample data for favorite cities
  const [favorites, setFavorites] = useState([
    { id: 1, name: "New York" },
    { id: 2, name: "San Francisco" },
  ]);

  const [newCity, setNewCity] = useState(""); // State to store new city name

  // Function to add a city to favorites
  const addFavoriteCity = () => {
    if (newCity.trim() !== "") {
      const newFavorite = { id: favorites.length + 1, name: newCity };
      setFavorites([...favorites, newFavorite]);
      setNewCity(""); // Clear the input field after adding
    }
  };

  // Function to remove a city from favorites
  const removeFavoriteCity = (id) => {
    const updatedFavorites = favorites.filter((city) => city.id !== id);
    setFavorites(updatedFavorites);
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Welcome to your user profile page!</p>

      <h3>Favorite Cities</h3>
      <ul>
        {favorites.map((city) => (
          <li key={city.id}>
            {city.name}
            <button onClick={() => removeFavoriteCity(city.id)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Input field to add a new favorite city */}
      <div>
        <input
          type="text"
          placeholder="Add a favorite city"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <button onClick={addFavoriteCity}>Add</button>
      </div>

      {/* Create a button/link to navigate back to the main page */}
      <Link to="/">Go Back to Main Page</Link>
    </div>
  );
};

export default User;
