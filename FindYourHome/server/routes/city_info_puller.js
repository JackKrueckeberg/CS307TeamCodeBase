// name, population, density, gdp, region, weather


// gets cities name, population and timezone(region)
async function getCities() {
    console.log("pulling city name, pop, timezone");
    link = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone&where=country_code%20%3D%20%22US%22%20and%20population%20%3E%20150000&limit=100`

    const response = await fetch(link);
    
    if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    return;
    }
    
    const cities = await response.json();

    console.log(cities);


    for (let i = 0; i < cities.results.length; i++) {
        writeCity(cities.results[i]);
    }


    return cities;
}

async function writeCity(city) {

    console.log("writing city...");
    console.log(city.name);
    // When a post request is sent to the create url, we'll add a new city to the database.
    await fetch("http://localhost:5050/city_populator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: city.name, population: city.population, timezone: city.timezone}),
      // JSON.stringify({ x: 5, y: 6 })
    })
    .catch(error => {
      console.log(error);
      return;
    });

}

getCities();



