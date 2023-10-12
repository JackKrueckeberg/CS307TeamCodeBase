import React, { useState, useEffect } from "react";
import "./RecentCitiesQueue.css"


const RecentCitiesQueue = ({ queue }) => {
    //const [user, setUser] = useState([]);

    // useEffect(() => {
    //     //get
    //     async function fetchData() {
    //         try {
    //             const response = await fetch(`http://localhost:5050/users/${email}`);
    //             if (!response.ok) {
    //                 const message = `An error occurred: ${response.statusText}`;
    //                 window.alert(message);
    //                 return;
    //             }

    //             const user = await response.json();
    //             setUser(user);
    //             console.log(user);
    //         } catch (error) {
    //             console.error("There was an error fetching the cities", error);
    //         }
    //     }

    //     fetchData();
    // }, []);

    return (
        <div>
            <h2>Recent Cities:</h2>
            <ul>
                {Object.values(queue.items).map(city => (
                    <li key={city}>{city}</li>
                ))}
            </ul>
        </div>
    );
}

export class Queue {
    constructor(items = {}, rear = 0, front = 0) {
        this.items = items;
        this.rear = rear;
        this.front = front;
    }

    async addToQueue(cityName) {
        let email = "nick@example.com";
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