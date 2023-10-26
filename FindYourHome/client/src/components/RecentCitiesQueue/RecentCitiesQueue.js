import React, { useState, useEffect } from "react";
import "./RecentCitiesQueue.css"

const RecentCitiesQueue = ({ queue }) => {
    const [queueItems, setQueueItems] = useState({});
    const [citiesToCompare, setCitiesToCompare] = useState([]);
    let email = "user2@example.com"
    const [selectedCities, setSelectedCities] = useState(new Set());
    const [errorMessage, setErrorMessage] = useState("");

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
            } catch (error) {
                console.error("There was an error fetching the cities", error);
            }
        }

        fillQueueFromDB();  // Call the function on component mount
    }, []);

    function addCity(item) {
        setCitiesToCompare([...citiesToCompare, item]);
    }

    function removeCites(itemToRemove) {
        setCitiesToCompare(citiesToCompare.filter(item => item !== itemToRemove));
    }

    const handleCityClick = (city) => {
        const newSelectedCities = new Set(selectedCities);
        if (newSelectedCities.has(city)) {
            newSelectedCities.delete(city);
            removeCites(city)
        } else {
            newSelectedCities.add(city);
            addCity(city);
        }
        setSelectedCities(newSelectedCities);
        console.log(citiesToCompare);
    };

    const handleCompareClick = (citiesToCompare) => {
        if (citiesToCompare.length > 2) {
            setErrorMessage("You've selected more than 2 cities. Please select only 2 cities to compare.");
        } else if (citiesToCompare.length < 2) {
            setErrorMessage("You've selected less than 2 cities. Please select 2 cities to compare.");
        } else {
            setErrorMessage(""); // Clear the error message when exactly 2 cities are selected
        }
    }


    return (
        <div>
            <h2>Recent Cities:</h2>
            <ul className="recently_viewed_cities">
                {Object.values(queue.items).map(city => (
                    <li
                        key={city}
                        onClick={() => handleCityClick(city)}
                        style={selectedCities.has(city) ? { color: 'blue' } : {}}
                    >
                        {city}
                    </li>
                ))}
            </ul>
    
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    
            <button onClick={() => handleCompareClick(citiesToCompare)}>Compare Cities</button>
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
    async addToQueue(cityName) {
        let email = "user2@example.com"; //mock email
        try {
            const updateData = {
                action: "addRecentCity",
                cityName: cityName
            };

            const response = await fetch(`http://localhost:5050/users/${email}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            console.log(response);

            if (!response.ok) {
                console.error(`Error while adding city to recentViewed: ${response.statusText}`);
            }
        } catch (error) {
            console.error("There was an error adding the city to recentViewed", error);
        }
    }

    enqueue(element) {
        const newItems = { ...this.items };
        for (const value of Object.values(newItems)) {
            if (value === element) {
                console.warn("Element already exists in the queue.");
                return this;
            }
        }

        newItems[this.rear] = element;
        this.addToQueue(element);  // Add to user's recentViewed cities list

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