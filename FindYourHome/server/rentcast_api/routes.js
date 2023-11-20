const fetch = require('node-fetch');
const fs = require('fs').promises;

const apiKey = '6a3d9417047e4ecebb8e90e10d2b3e8f'; // Replace with your actual API key

// Function to retrieve all properties for sale in New York City
const getAllPropertiesForSaleInNYC = async () => {
  try {
    const apiUrl = 'https://api.rentcast.io/v1/listings/sale';

    const queryParams = new URLSearchParams({
      city: 'New York City',
      limit: 10000,
    });

    const url = `${apiUrl}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Example usage:
getAllPropertiesForSaleInNYC()
  .then(async (data) => {
    try {
      // Write data to a local file
      await fs.writeFile('properties.txt', JSON.stringify(data, null, 2));
      console.log('All properties for sale in New York City data has been written to properties.txt');
    } catch (writeError) {
      console.error('Error writing to file:', writeError);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
