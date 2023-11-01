import React, { useState } from "react";
// import "./RecentDiscussionsQueue.css"

export class Queue {
    constructor(items = {}, rear = 0, front = 0) {
        this.items = items;
        this.rear = rear;
        this.front = front;
    }

    enqueue(element) {
        const newItems = { ...this.items };

        for (const value of Object.values(newItems)) {
            if (value === element) {
                console.warn("Element already exists in the queue.");
                return this; // Return the current state of the queue without changes.
            }
        }

        newItems[this.rear] = element;

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

const RecentDiscussionsQueue = ({ queue }) => {
    return (
        <div>
            <h2>Recently Discussed Cities</h2>
            <ul>
                {Object.values(queue.items).map(city => (
                    <li key={city}>{city}</li>
                ))}
            </ul>
        </div>
    );
}

export default RecentDiscussionsQueue;