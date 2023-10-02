// Autocomplete.js




import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

class Autocomplete extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  // Function to handle input value change
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  // Function to provide suggestions based on user input
  onSuggestionsFetchRequested = async ({ value }) => {
    try {
      // Fetch city data from your server using an API request
      const response = await fetch(`http://localhost:5050/cities?search=${value}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({
          suggestions: data,
        });
      } else {
        console.error('Error fetching city data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  // Function to clear suggestions when input is cleared
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // Function to render suggestion items
  renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search for a city',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default Autocomplete;






















/*
import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

// Sample data for autocomplete suggestions (replace with your data source)
const cities = [
  { name: 'San Francisco' },
  { name: 'Santa Cruz' },
  { name: 'San Ramon' },
  // Add more city objects as needed
];







class Autocomplete extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  // Function to handle input value change
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  // Function to provide suggestions based on user input
  onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const matchingCities = cities.filter(city =>
      city.name.toLowerCase().startsWith(inputValue)
    );

    this.setState({
      suggestions: matchingCities,
    });
  };

  // Function to clear suggestions when input is cleared
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // Function to render suggestion items
  renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search for a city',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default Autocomplete;
*/