// name, population, density, gdp, region, weather



// gets cities name, population and timezone(region)


async function getCitiesIterative() {

    // start by pulling the top 100 cities
    top100 = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone%2C%20admin1_code%2C%20latitude%2C%20longitude&where=country_code%20%3D%20%22US%22&order_by=population%20DESC&limit=100`;

    var response = await fetch(top100); // pulls cities
    
    if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        return;
    }
    
    var cities = await response.json();

    console.log(cities);


    for (let i = 0; i < cities.results.length; i++) {
        const curCity = await(findZipCode(cities.results[i]));
        writeCity(curCity); // writes each of top 100
    }

    round = 1

    while (round < 50) { // gets the next 100 dynamically editing the URL

        nextLink = new URL(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone%2C%20admin1_code%2C%20latitude%2C%20longitude&where=country_code%20%3D%20%22US%22%20and%20population%20%3C%20` + cities.results[99].population + `&order_by=population%20DESC&limit=100`)

        response = await fetch(nextLink);
    
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            return;
        }
        
        cities = await response.json();
    
        console.log(cities);
    
    
        for (let i = 0; i < cities.results.length; i++) {
            const curCity = await(findZipCode(cities.results[i]));
            writeCity(curCity); // writes the cities
        }
        
        round++;
        
    }

}

async function findZipCode(c) {

    console.log("findzipcode");

    //var city = 'Portland'
    //var state = 'OR'

    var city = c.name;

    var state = c.admin1_code;

    const regex = / city$/i;

    // Use the replace method to remove ' city' from the end of the string
    var city = c.name.replace(regex, '');
 
   response = await fetch('https://api.api-ninjas.com/v1/zipcode?city=' + city + '&state=' + state, {
     method: "GET",
     headers: {
        'X-Api-Key': 'hlz7WFgKyDOIq90SaBM04g==CKM9L9hoyXSCx6n7',
        "Content-Type": "application/json",
     }
   })
   .catch(error => {
     console.log('81 err')
     console.log(error);
     return c;
   }
   );

   const resp = await response.json();

   if (resp.length == 0) {
        return c;
   }

   c.zip_code = resp[0].zip_code;
   c.county = resp[0].county;

   const newCity = await findIncome(c);

   return newCity;

}


async function findIncome(city) {

    console.log("findincome");
    
    //var county = "Multnomah County"
    //var state = "OR"

    var county = city.county;
    var state = city.admin1_code;

    link = 'https://www.huduser.gov/hudapi/public/fmr/listCounties/' + state;
    key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY2YmUxZDhmZTdkMTc4YjllY2UxNzJkZGQ0YjhkMWUzZDBkNTUyZTdjZjM3OWUxZjFkZWMxMTUyN2Q5YjZhMWYyYjVmNDdhZTQ1NDNmZDE0In0.eyJhdWQiOiI2IiwianRpIjoiNjZiZTFkOGZlN2QxNzhiOWVjZTE3MmRkZDRiOGQxZTNkMGQ1NTJlN2NmMzc5ZTFmMWRlYzExNTI3ZDliNmExZjJiNWY0N2FlNDU0M2ZkMTQiLCJpYXQiOjE2OTU5MjQzMzMsIm5iZiI6MTY5NTkyNDMzMywiZXhwIjoyMDExNTQzNTMzLCJzdWIiOiI1OTQ0OCIsInNjb3BlcyI6W119.FMgClTnq6B1I4afNP0JuYLIxUokqDSkq7_nGrjrWD1JR9tPigdgoqAI7IxWNfAngKqId-P2CCd9XaCMUmzY0CA';

    //"Authorization: Bearer YOUR_API_KEY" https://www.huduser.gov/hudapi/public/fmr/listCounties/ + state 

    response = await fetch(link, {
        method: "GET",
        headers: {
            "Authorization" : "Bearer " + key, 
            "Content-Type": "application/json"
        }
      })
      .catch(error => {
        console.log("Error pulling fips")
        console.log(error);
        return city;
      }
      );

      var resp = '';
      try {
        resp = await response.json();
      } catch (error) {
        return city;
      }


      var fips = '';

      for (var i = 0; i < resp.length; i++) {
        if(resp[i].county_name == county) {
            console.log(resp[i].fips_code);
            fips = resp[i].fips_code;
        }
      }

      if (fips == '') {
        return city;
      }

      incomeLink = `https://www.huduser.gov/hudapi/public/il/data/` + fips;

      incomeResponse = await fetch(incomeLink, {
        method: "GET",
        headers: {
            "Authorization" : "Bearer " + key, 
            "Content-Type": "application/json"
        }
      })
      .catch(error => {
        console.log("Error getting income");
        console.log(error);
        return city;
      });

      console.log('pulled everything!');

      var incomeResp = '';

      try {
        incomeResp = await incomeResponse.json();
      } catch (error) {
        return city
      }


      if (incomeResp.data.median_income == 'undefined:1') {
        return city;
      }
    
      city.median_income = incomeResp.data.median_income;

      console.log("med income: " + incomeResp.data.median_income);

      return city;
}

async function getCity() {
    top1 = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?select=name%2C%20population%2C%20timezone%2C%20admin1_code%2C%20latitude%2C%20longitude&where=country_code%20%3D%20%22US%22&order_by=population%20DESC&limit=1`;

    var response = await fetch(top1); // pulls cities
    
    if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        return;
    }
    
    var cities = await response.json();

    const newCity = await findZipCode(cities.results[0]);

    console.log(newCity);


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
      body: JSON.stringify({name: city.name,
                            population: city.population,
                            timezone: city.timezone,
                            state: city.admin1_code,
                            lat: city.latitude,
                            lon: city.longitude,
                            zip_code: city.zip_code,
                            county: city.county,
                            median_income: city.median_income
                            }),
    })
    .catch(error => {
      console.log("write err");
      console.log(error);
    });
    

}


getCitiesIterative();

//findZipCode();

//findIncome();

//getCity();





