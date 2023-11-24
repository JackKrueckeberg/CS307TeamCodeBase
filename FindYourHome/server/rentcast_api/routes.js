const fetch = require('node-fetch');
const fs = require('fs').promises;

const apiKey = '880b2dfa31df4895be9d0a7f7a428f7b'; // Replace with your actual API key

// Function to retrieve all properties for sale in New York City
const getAllPropertiesForSaleInNYC = async () => {
  try {
    const apiUrl = 'https://api.rentcast.io/v1/listings/sale';

    const queryParams = new URLSearchParams({
      city: 'Danville',
      limit: 150,
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
      await fetch("http://localhost:5050/city_info/Danville", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({properties: data})
      }).catch((error) => {
        //window.alert(error);
        console.log("error")
        return;
      });
    } catch (writeError) {
      console.error('Error writing to file:', writeError);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  async function reply(content) {
      
    } 