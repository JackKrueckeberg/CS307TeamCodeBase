import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useCity } from "../../contexts/CityContext";
import './propertyList.css';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const city = JSON.parse(localStorage.getItem('selectedCity')).name;

  

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
    <div className="property-list-container">
      <label htmlFor="propertyType">Filter By Property Type:</label>
      <select className="filter-select" id="propertyType" onChange={handlePropertyTypeChange}>
        <option value="">Select...</option>
        {/* Replace property types with your actual property types */}
        <option value="Single Family">Single Family</option>
        <option value="Apartment">Apartment</option>
        <option value="Condo">Condo</option>
      </select>

      {/* Display the common link at the top */}
      <div className="common-link">
        <Link to={getZillowLink(properties.length > 0 ? properties[0].city : '', properties.length > 0 ? properties[0].state : '', propertyTypeFilter)}>
          {commonLinkMessage}
        </Link>
      </div>

      <ul className="property-list">
        {filterPropertiesByType().map((property, index) => (
          <li key={index} className="property-item">
            <strong>{property.formattedAddress}</strong>
            <p>Property Type: {property.propertyType}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Listed Price: ${property.price}</p>
            

          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
