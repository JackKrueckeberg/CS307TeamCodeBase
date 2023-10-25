import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";
import Map, { lat, lon, cityName } from "./leaflet/leaflet";
import { CityModel, Model } from "./CityModel/CityModel";
import "../Stylings/ViewCity.css";
import Twitter from "./twitter";
import { useCity } from "../contexts/CityContext";


export default function CityPage(props) {
    const currentUser = localStorage.getItem("currentCity");
    const {city: globalCity} = useCity();



  return (
    <div>
        <div className="result">
            <label content={globalCity.lon}></label>
            {globalCity.name && globalCity && <CityModel model={globalCity} />}
            {globalCity.name && globalCity && <Map key={`${globalCity.lat}-${globalCity.lon}`} lat={globalCity.lat} lon={globalCity.lon} />}
        </div>
        <Twitter cityName = {globalCity.name}></Twitter>

    </div>
  );
}
