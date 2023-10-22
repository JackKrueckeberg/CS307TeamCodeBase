import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export const CityModel = ({ model }) => {
    const [cityList, setCityList] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        if (model && !cityList[model.name]) {
            setCityList(prevCityList => ({
                ...prevCityList,
                [model.name]: model
            }));
        }
    }, [model]);

    let national_income;
    if (model.nation_flag === true) {
        national_income = "greater";
    }else {
        national_income = "less";
    }

    return (
        <div>
            <div className="model">
                <h2>{model.name}</h2>
                <p>Population: {model.population}</p>
                <p>Region: {model.region}</p>
                <p>State: {model.state}</p>
                <p>Median Income: {model.median_income}</p>
                <p>This is ${model.nation_avg} {national_income} than the National Medium Income Average</p>
                <button onClick={() => navigate("/city-information")}>Click here for more information</button>
                <img src={model.img_url} alt={model.name} />
            </div>
        </div>
    )
}

export class Model {
    constructor(name, population, region, state, median_income, img_url, nation_avg, nation_flag) {
        this.name = name;
        this.population = population;
        this.region = region;
        this.state = state;
        this.median_income = median_income;
        this.img_url = img_url;
        this.nation_avg = nation_avg;
        this.nation_flag = nation_flag;
    }
}
