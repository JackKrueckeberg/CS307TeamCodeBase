import React, { useState } from "react";
import "./ViewCity.css";

const ViewCity = () => {
  const [City, setCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [clear, setClear] = useState(false);

  // Dummy data
  const fakeCity = [
    { name: "New York", country: "USA" },
    { name: "London", country: "UK" },
    { name: "Tokyo", country: "Japan" },
    { name: "Paris", country: "France" },
    // Add more fake City as needed
  ];

  //fetch data from fake data depending on the search
  const fetchData = () => {
    const index = fakeCity.findIndex(city => city.name === searchTerm);
    if (index !== -1) { //set results if match is found
      setCity(fakeCity[index]);
      setShowResults(true);
    } else { //dont set if not match is found
      setShowResults(false);
    }
    setClear(false);
  };

  //clear the page of divs
  const handleClear = () => { 
    setClear(true);
    setShowResults(false);
  };

 //display the correct
  const renderResults = () => {
    if (showResults && City) {
      return (<div className="result">
        <h2>{City.name}</h2>
        <p>{City.country}</p>
      </div>);
    }else if (clear) {
      return(
        <div>
        <h2></h2>
        <p></p>
      </div>
      );
    }
    else {
      return (<div className="result">
        <h2>Invalid Search</h2>
      </div>);
    }
  }

  return (
    <div>
      <h1 className="header">View City Page</h1>

      <div className="searchBar">
        <label>Search</label>
        <input type="text" placeholder="Enter a city" value={searchTerm} onChange={e => { setSearchTerm(e.target.value) }} />
        <button className="submitButton" onClick={fetchData}>Submit</button>
        <button className="clearButton" onClick={handleClear}>Clear</button>
      </div>

      <div className="renderResults">
        {renderResults()}
      </div>

    </div>
  );
};

export default ViewCity;