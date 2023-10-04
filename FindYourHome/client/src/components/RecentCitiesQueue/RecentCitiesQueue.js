import React, { useState } from "react";
import "./RecentCitiesQueue.css"

export class Queue {
    constructor(items = {}, rear = 0, front = 0) {
        this.items = items;
        this.rear = rear;
        this.front = front;
    }

    enqueue(element) {
        if (this.size() >= 10) {
            this.dequeue();
        }
        const newItems = { ...this.items };
        newItems[this.rear] = element;
        return new Queue(newItems, this.rear + 1, this.front);
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

const RecentCitiesQueue = ({ queue }) => {
    return (
        <div>
            <h2>Recent Cities:</h2>
            <ul>
                {Object.values(queue.items).map((city, index) => (
                    <li key={index}>{city}</li>
                ))}
            </ul>
        </div>
    );
}

export default RecentCitiesQueue;