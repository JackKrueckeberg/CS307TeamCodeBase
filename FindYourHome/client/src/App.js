import React from "react";
import SearchBar from './components/SearchBar'; // Adjust the path as needed
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app

 
const App = () => {
 return (
  <div className="App">
  <h1>City Search</h1>
  <SearchBar />
</div>
 );
};
 
export default App;