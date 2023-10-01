import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/advancedPrefs.css";
 
export default function Create() {
 const [form, setForm] = useState({
    population: "",
    east_coast: false,
    west_coast: false,
    central: false,
    mountain_west: false,
    state: "",
    zip_code: "",
    county: "",
    median_income: "",
 });



  // These methods will update the state properties.
  function updateForm(value) { 
    return setForm((prev) => {
        return { ...prev, ...value };
    });
  }

  async function getCities() {
    const city_info = await fetch("http://localhost:5050/city_info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch(error => {
        window.alert(error);
        return;
      });
  
      const resp = await city_info.json();

      return resp;
  }


   async function filterCities() {
    const cities = await getCities()
    var resultArr = [];
    for (var i = 0; i < cities.length; i++) {
        if (form.east_coast) {
            if (cities[i].region === "America/New_York") {
                resultArr.push(cities[i]);
            }
        }
        if (form.central) {
            if (cities[i].region === "America/Chicago") {
                resultArr.push(cities[i]);
            }
        }
        if (form.mountain_west) {
            if (cities[i].region === "America/Phoenix") {
                resultArr.push(cities[i]);
            }
        }
        if (form.west) {
            if (cities[i].region === "America/Los_Angeles") {
                resultArr.push(cities[i]);
            }
        }
    }

    return resultArr;
  }

   // This function will handle the submission.
 async function onSubmit(e) {
    e.preventDefault();
    
    console.log("searching...");
    var result = await filterCities();

    console.log(result);
  
    setForm({    
        population: "",
        east_coast: false,
        west_coast: false,
        central: false,
        mountain_west: false,
        state: "",
        zip_code: "",
        county: "",
        median_income: "" 
    });
  }

 
 const navigate = useNavigate();
 
 
 // This following section will display the form that takes the input from the user.
 return (

    // name, population, region, state, zip code, county, median income
    <div>
        <button type="button" className="collapsible">Advanced Preferences</button>
        <div className="content center">
            <h1>Test Header!</h1>


            <form onSubmit={onSubmit}>
                <h3>Preferences:</h3>
                <table class={"table_style padding"}>
                    <tr>
                        <input 
                            placeholder="Population Preference" 
                            type="number"
                            value={form.population}
                            onChange={(e) => updateForm({ population: e.target.value })}
                        />       
                    </tr>
                    <tr>
                        <label>Region Preference:</label>
                    </tr>
                    <tr>
                        <label className="padding">East Coast  </label>
                        <input
                            className="padding"
                            type="checkbox"
                            value={form.east_coast}
                            onChange={(e) => updateForm({ east_coast: !form.east_coast })}
                        />
                    </tr>
                    <tr>
                        <label className="padding">West Coast  </label>
                        <input
                            className="padding" 
                            type="checkbox"
                            value={form.west_coast}
                            onChange={(e) => updateForm({ west_coast: !form.west_coast })}
                        />
                    </tr>
                    <tr>
                        <label className="padding">Central  </label>
                        <input
                            className="padding"
                            type="checkbox"
                            value={form.central}
                            onChange={(e) => updateForm({ central: !form.central })}
                        />
                    </tr>
                    <tr>
                        <label className="padding">Mountain West  </label>
                        <input 
                            className="padding"
                            type="checkbox"
                            value={form.mountain_west}
                            onChange={(e) => updateForm({ mountain_west: !form.mountain_west })}
                        />
                    </tr>
                    <tr>
                        <select name="states" id="states"
                            className="padding"
                            value={form.state}
                            onChange={(e) => updateForm({ state: e.target.value })}
                        >
                            <option value="none" selected="selected">State Preference</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </select>
                    </tr>
                    <div className="padding"/>
                    <tr>
                        <input 
                            className="padding"
                            placeholder="Zip Code Preference"
                            value={form.zip_code}
                            onChange={(e) => updateForm({ zip_code: e.target.value })}
                        />
                    </tr>
                    <div className="padding"/>
                    <tr className="padding">
                        <input 
                            className="padding"
                            placeholder="County Preference"
                            value={form.county}
                            onChange={(e) => updateForm({ county: e.target.value })}
                        />
                    </tr>
                    <div className="padding"/>
                    <tr className="padding">
                        <input placeholder="Income Preference" type="Number"
                            className="padding"
                            value={form.median_income}
                            onChange={(e) => updateForm({ median_income: e.target.value })}
                        />
                    </tr> 
                    <div className="padding"/>
                    <input
                        type="submit"
                        value="search"
                        className="btn btn-primary"
                    />
                </table>
            </form>
        </div>
   </div>
 );
}