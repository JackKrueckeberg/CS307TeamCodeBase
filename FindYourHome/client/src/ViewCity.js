import React, { useState, useEffect } from "react";
import "./ViewCity.css";

const ViewCity = () => {
  // const [City, setCity] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [showResults, setShowResults] = useState(false);
  // const [clear, setClear] = useState(false);

  const [city, setCity] = useState([]);

  useEffect(() => {
    //fetch data from fake data depending on the search
    async function fetchData() {
      const response = await fetch(`http://localhost:5050/record/cities_full_2`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const city = await response.json();
      setCity(city);
    }; 

    fetchData();
;

    return
  }, [city.length]);


//   //clear the page of divs
//   const handleClear = () => {
//     setClear(true);
//     setShowResults(false);
//   };

//   //display the correct
//   const renderResults = () => {
//     if (showResults && City) {
//       return (<div className="result">
//         <h2>{City.name}</h2>
//         <p>{City.country}</p>
//       </div>);
//     } else if (clear) {
//       return (
//         <div>
//           <h2></h2>
//           <p></p>
//         </div>
//       );
//     }
//     else {
//       return (<div className="result">
//         <h2>Invalid Search</h2>
//       </div>);
//     }
//   }

//   return (
//     <div>
//       <h1 className="header">View City Page</h1>

//       <div className="searchBar">
//         <label>Search</label>
//         <input type="text" placeholder="Enter a city" value={searchTerm} onChange={e => { setSearchTerm(e.target.value) }} />
//         <button className="submitButton" onClick={fetchData}>Submit</button>
//         <button className="clearButton" onClick={handleClear}>Clear</button>
//       </div>

//       <div className="renderResults">
//         {renderResults()}
//       </div>

//     </div>
//   );
};

export default ViewCity;