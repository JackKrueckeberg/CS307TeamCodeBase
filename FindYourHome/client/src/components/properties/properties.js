import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useCity } from "../../contexts/CityContext";
import { useNavigate } from "react-router-dom";
import './properties.css';


const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const city = JSON.parse(localStorage.getItem('selectedCity')).name;
  const navigate = useNavigate();

  useEffect(() => {
    // Call the function to get favorite cities when the component mounts
    getProperties();
  }, []);


  async function getProperties() {
    try {
      const city_info = await fetch("http://localhost:5050/city_info/" + city, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });


      const resp = await city_info.json();
      const properties = resp.properties;


      setProperties(properties);


    } catch (error) {
      window.alert(error);
    }
  }


  const handlePropertyTypeChange = (e) => {
    setPropertyTypeFilter(e.target.value);
  };


  const filterPropertiesByType = () => {
    if (propertyTypeFilter) {
      return properties.filter((property) => property.propertyType === propertyTypeFilter);
    }
    return properties;
  };


  const getZillowLink = (city, state, propertyType) => {
    // Replace spaces in city and state with dashes
    const formattedCity = city.replace(/\s+/g, '-').toLowerCase();
    const formattedState = state.replace(/\s+/g, '-').toLowerCase();
   
    // Create the Zillow URL
    return `https://zillow.com/${formattedCity}-${formattedState}/${propertyType}`;
  };


  // Common link to display at the top
  const commonLinkMessage = propertyTypeFilter
    ? `View ${propertyTypeFilter === 'Single Family' ? 'Single Family Home' : propertyTypeFilter}s in ${properties.length > 0 ? properties[0].city : 'City'} on Zillow`
    : `View all properties in ${properties.length > 0 ? properties[0].city : 'City'} on Zillow`;


  return (

    <div className="root">
      <div className="property-list-container">
        <button className="button" onClick={() => navigate('/view-city')}>
          Back to View City
        </button>
        <label htmlFor="propertyType">Filter By Property Type:</label>
        <select className="filter-select" id="propertyType" onChange={handlePropertyTypeChange}>
          <option value="">Select...</option>
          <option value="Single Family">Single Family</option>
          <option value="Apartment">Apartment</option>
          <option value="Condo">Condo</option>
        </select>


        {/* Display the common link at the top */}
        <div className="common-link">
        
        </div>


        <ul className="property-list">
          {filterPropertiesByType().map((property, index) => (
            <li key={index} className="property-item">
              <strong>{property.formattedAddress}</strong>
              <p className='property-text'>Property Type: {property.propertyType}</p>
              <p className='property-text'>Bedrooms: {property.bedrooms}</p>
              <p className='property-text'>Bathrooms: {property.bathrooms}</p>
              <p className='property-text'>Listed Price: ${property.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default PropertyList;


