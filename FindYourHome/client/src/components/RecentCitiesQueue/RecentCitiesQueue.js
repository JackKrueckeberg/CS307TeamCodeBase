import React, { useState, useEffect } from "react";
import "./RecentCitiesQueue.css"
import { useNavigate } from "react-router-dom";
import { useCompareCities } from "../../contexts/CityContext";
import { useLocalStorage } from "@uidotdev/usehooks";

const RecentCitiesQueue = ({ queue }) => {
    const navigate = useNavigate();
    const [queueItems, setQueueItems] = useState({});
    let email = "user2@example.com"
    const [selectedCities, setSelectedCities] = useState(new Set());
    const [errorMessage, setErrorMessage] = useState("");

    const getCompareCitiesFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem('compareCities') || '[]').filter(city => city); // Filters out null, undefined, and other falsy values
    };
    
    const setCompareCitiesToLocalStorage = (cities) => {
        const filteredCities = cities.filter(city => city); // Ensure no null or undefined values
        localStorage.setItem('compareCities', JSON.stringify(filteredCities));
    };


    const compareCities = getCompareCitiesFromLocalStorage();

    useEffect(() => {
        // Define the function inside useEffect
        async function fillQueueFromDB() {
            try {
                const response = await fetch(`http://localhost:5050/users/${email}`);

                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    throw new Error(message);
                }

                const data = await response.json();
                queue.items = data.recent_cities; // update the state
                //setQueueItems(data.recent_cities);
            } catch (error) {
                console.error("There was an error fetching the cities", error);
            }
        }

        fillQueueFromDB();  // Call the function on component mount
    }, []);

    function addCity(cityModel) {
        if (cityModel && !compareCities.some(city => city.name === cityModel.name)) {
            const newCompareCities = [...compareCities, cityModel];
            setCompareCitiesToLocalStorage(newCompareCities);
        }
    }
    
    function removeCites(cityModelToRemove) {
        const newCompareCities = compareCities.filter(city => city.name !== cityModelToRemove.name);
        setCompareCitiesToLocalStorage(newCompareCities);
    }
    
    const handleCityClick = (cityName) => {
        const cityModel = Object.values(queue.items).find(city => city.name === cityName);
    
        if (compareCities.some(city => city.name === cityName)) {
            removeCites(cityModel);
        } else {
            addCity(cityModel);
        }
        setSelectedCities(prevSelectedCities => {
            const newSelectedCities = new Set(prevSelectedCities);
            if (newSelectedCities.has(cityName)) {
                newSelectedCities.delete(cityName);
            } else {
                newSelectedCities.add(cityName);
            }
            return newSelectedCities;
        });
    };
    

    const handleCompareClick = () => {
        const selectedCount = selectedCities.size; // Get the size of the selectedCities set
    
        if (selectedCount > 2) {
            setErrorMessage("You've selected more than 2 cities. Please select only 2 cities to compare.");
        } else if (selectedCount < 2) { // Check if less than 2 cities are selected
            setErrorMessage("You've selected less than 2 cities. Please select 2 cities to compare.");
        } else {
            setErrorMessage("");
            navigate("/compare");
        }
    };


    return (
        <div>
            <h2>Recent Cities:</h2>
            {Object.values(queue.items).map(cityModel => (
                <li
                    key={cityModel.name}
                    onClick={() => handleCityClick(cityModel.name)}
                    style={selectedCities.has(cityModel.name) ? { color: 'blue' } : {}}
                >
                    {cityModel.name}
                </li>
            ))}


            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <button onClick={() => handleCompareClick(compareCities)}>Compare Cities</button>
        </div>
    );

}

export class Queue {
    constructor(items = {}, rear = 0, front = 0) {
        this.items = items;
        this.rear = rear;
        this.front = front;
    }

    //add the contents of the queue to the recent_cities field of a user based of their email
    async addToQueue(cityModel) {
        let email = "user2@example.com"; //mock email
        try {
            const updateData = {
                action: "addRecentCity",
                cityModel: cityModel
            };
    
            const response = await fetch(`http://localhost:5050/users/${email}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
    
            if (!response.ok) {
                console.error(`Error while adding city to recentViewed: ${response.statusText}`);
            }
        } catch (error) {
            console.error("There was an error adding the city to recentViewed", error);
        }
    }
    

    enqueue(cityModel) {
        const newItems = { ...this.items };
        for (const value of Object.values(newItems)) {
            console.log(value);
            if (value.name === cityModel.name) {
                console.warn("City model already exists in the queue.");
                return this;
            }
        }
    
        newItems[this.rear] = cityModel;
        this.addToQueue(cityModel);  // Add to user's recentViewed cities list
    
        let newFront = this.front;
        let newRear = this.rear + 1;
    
        if ((newRear - newFront) > 10) {
            delete newItems[newFront];
            newFront++;
        }
    
        const newQueue = new Queue(newItems, newRear, newFront);
        return newQueue;
    }

    dequeue() {
        const newItems = { ...this.items };
        delete newItems[this.front];
        return new Queue(newItems, this.rear, this.front + 1);
    }

    isEmpty() {
        return this.rear - this.front === 0;
    }

    size() {
        return this.rear - this.front;
    }

    print() {
        console.log(this.items);
    }
}

export default RecentCitiesQueue;