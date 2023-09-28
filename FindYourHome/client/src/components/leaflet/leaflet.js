// src/Map.js
import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import the Leaflet library

class Map extends Component {
    componentDidMount() {
      // Use the latitude and longitude from props to set the map's center
      const { lat, lon } = this.props;
      this.map = L.map('map').setView([lat, lon], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
  
    //   L.marker([lat, lon]).addTo(this.map)
    //     .bindPopup('A popup here!');
    }
  
    render() {
      return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
    }
  }
  
  export default Map;

      
      
      
      
      
      
