import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

class Map extends Component {
  state = {
    mapVisible: true,
    mapInitialized: false, // Track whether the map has been initialized
  };

  mapRef = React.createRef(); // Create a ref for the map container

  toggleMapVisibility = () => {
    this.setState((prevState) => ({
      mapVisible: !prevState.mapVisible,
    }));
  };

  componentDidMount() {
    const { lat, lon } = this.props;

    if (!this.state.mapInitialized) {
      this.map = L.map(this.mapRef.current).setView([lat, lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.setState({ mapInitialized: true }); // Set mapInitialized to true once the map is initialized
    }
  }

  render() {
    const { mapVisible } = this.state;

    return (
      <div>
        <button onClick={this.toggleMapVisibility}>
          {mapVisible ? 'Hide Map' : 'Show Map'}
        </button>
        <h2 style={{ color: 'rgb(220, 215, 201)' }}>City Map</h2>
        <div
          ref={this.mapRef} // Assign the ref to the map container
          id="map"
          style={{
            width: '100%',
            height: '500px',
            display: mapVisible ? 'block' : 'none',
          }}
        ></div>
      </div>
    );
  }
}

export default Map;
