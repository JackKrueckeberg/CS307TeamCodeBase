import React, { useState, useEffect } from "react";
import { useUser } from '../contexts/UserContext';

export default function MessageBoard() {
    const [messages, setMessages] = useState([]);
    const {user: userProfile } = useUser(); // the id of the current logged in user

    useEffect(() => {
        fetchUserMessages();
    }, []);

    // get the messages that the user has
    const fetchUserMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5050/messageRoute/${userProfile._id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            const resp = await response.json();

            setMessages(resp.favorite_searches);

            console.log(resp.favorite_searches);
    
            return resp.favorite_searches;
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

    return (
        <div>
          <h2>Chat Messages</h2>
          <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {Object.entries(message).map(([key, value]) => {
                            if (value !== null && value !== "" && value !== false) {
                            return (
                                <span key={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                </span>
                            );
                            }
                            return null; // Don't display if the field is not populated
                        })}
                    </li>
                ))}
            </ul>
        </div>
      );
};