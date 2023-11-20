import React, { useState } from 'react';
import propertiesData from './properties.json';
import './propertyList.css';

const PropertyList = () => {
  const [properties] = useState(propertiesData);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');

  const handlePropertyTypeChange = (e) => {
    setPropertyTypeFilter(e.target.value);
  };

  const filterPropertiesByType = () => {
    if (propertyTypeFilter) {
      return properties.filter((property) => property.propertyType === propertyTypeFilter);
    }
    return properties;
  };

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
