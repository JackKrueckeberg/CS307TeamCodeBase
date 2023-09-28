// name, population, density, gdp, region, weather


// gets cities name, population and timezone(region)


async function getCitiesIterative() {

    // start by pulling the top 100 cities
    //top100 = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone%2C%20admin1_code&where=country_code%20%3D%20%22US%22&order_by=population%20DESC&limit=100`;
    top100 = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone%2C%20admin1_code%2C%20latitude%2C%20longitude&where=country_code%20%3D%20%22US%22&order_by=population%20DESC&limit=100`;

    var response = await fetch(top100); // pulls cities
    
    if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        return;
    }
    
    var cities = await response.json();

    console.log(cities);


    for (let i = 0; i < cities.results.length; i++) {
        writeCity(cities.results[i]); // writes each of top 100
    }

    round = 1

    while (round < 50) { // gets the next 100 dynamically editing the URL

        //nextLink = new URL(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone%2C%20admin1_code&where=country_code%20%3D%20%22US%22%20and%20population%20%3C%20` + cities.results[99].population + `&order_by=population%20DESC&limit=100`);
        nextLink = new URL(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone%2C%20admin1_code%2C%20latitude%2C%20longitude&where=country_code%20%3D%20%22US%22%20and%20population%20%3C%20` + cities.results[99].population + `&order_by=population%20DESC&limit=100`)

        response = await fetch(nextLink);
    
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            return;
        }
        
        cities = await response.json();
    
        console.log(cities);
    
    
        for (let i = 0; i < cities.results.length; i++) {
            writeCity(cities.results[i]); // writes the cities
        }
        
        round++;
        
    }


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
      body: JSON.stringify({name: city.name, population: city.population, timezone: city.timezone, state: city.admin1_code, lat: city.latitude, lon: city.longitude}),
      // JSON.stringify({ x: 5, y: 6 })
    })
    .catch(error => {
      console.log(error);
      return;
    });

}


getCitiesIterative();



