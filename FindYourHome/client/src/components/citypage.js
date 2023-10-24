import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";
import Map, { lat, lon, cityName } from "./leaflet/leaflet";
import { CityModel, Model } from "./CityModel/CityModel";
import "../Stylings/ViewCity.css";
import Twitter from "./twitter";


export default function CityPage(props) {


  return (
    <div>
        <div className="result">
            <label content={props.cityCoordinates.lon}></label>
            {props.showResults && props.city && <CityModel model={props.cityModel} />}
            {props.showResults && props.city && <Map key={`${props.cityCoordinates.lat}-${props.cityCoordinates.lon}`} lat={props.cityCoordinates.lat} lon={props.cityCoordinates.lon} />}
        </div>
        <Twitter cityName = {props.city.name}></Twitter>

    </div>
  );
}
