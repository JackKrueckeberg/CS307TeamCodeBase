import React, { useState, useEffect } from "react";

export const CityModel = ({ model }) => {
    const [cityList, setCityList] = useState({});

    useEffect(() => {
        if (model && !cityList[model.name]) {
            setCityList(prevCityList => ({
                ...prevCityList,
                [model.name]: model
            }));
        }
    }, [model]);

    console.log(cityList);

    return (
        <div>
            <div>
                <h2>{model.name}</h2>
                <p>Population: {model.population}</p>
                <p>Region: {model.region}</p>
                <p>State: {model.state}</p>
                <p>Median Income: {model.median_income}</p>
                <img src={model.img_url} alt={model.name} />
            </div>
        </div>
    )
}

export class Model {
    constructor(name, population, region, state, median_income, img_url) {
        this.name = name;
        this.population = population;
        this.region = region;
        this.state = state;
        this.median_income = median_income;
        this.img_url = img_url;
    }
}
