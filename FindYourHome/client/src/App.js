import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import Map from "./components/leaflet/leaflet.js"
 
const App = () => {
  const city = {
    name: "Los Angeles",
    population: 3898747,
    region: "America/Los_Angeles",
    state: "CA",
    lat: "34.05223",
    lon: "-118.24368"
  };
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<RecordList />} />
       <Route path="/edit/:id" element={<Edit />} />
       <Route path="/create" element={<Create />} />
     </Routes>
     <h2>Map of {city.name}</h2>
     <Map lat={city.lat} lon={city.lon} />
   </div>

 
 );
};
 
export default App;