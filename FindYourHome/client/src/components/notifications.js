import React, { useState, useEffect } from "react";
import { useUser } from '../contexts/UserContext';

export default function Notifications() {
    const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const storedLocUser = JSON.parse(localStorage.getItem('currentUser'));

    const {user: userProfile } = useUser(); // the id of the current logged in user
    const [user, setInfo] = useState( storedSesUser || storedLocUser || userProfile );

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // fetch user data from the backend when the component mounts
        const intervals = setInterval(() => {
            fetchUserInfo();

          }, 5000); // 5000 milliseconds = 5 seconds
      
          // The cleanup function to clear the interval when the component unmounts
          return () => {
            clearInterval(intervals);
          };
    }, []);
    // fetch the user data from the backend
    const fetchUserInfo = async () => {
        try {

            console.log(`This is value of user ${user._id}`);
            const response = await fetch(`http://localhost:5050/profileRoute/profile/${user._id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            if (response.status === 200) {
                const userInfo = await response.json();
                console.log(userInfo);
                // Update the user state with the fetched data
                setNotifications(userInfo.notifications);
            }
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }



    return (
        <div className="notification-content">
            {notifications.length > 0 ? (
                <ul className="notifications-list">
                    {notifications.map((note, index) => (
                        <li
                            key={index}
                            className={"TODO"}
                        >
                            <div className="notification">
                            <h5 className="notification-message">{note.content}</h5>
                            <p className="notification-timestamp">{new Date(note.time).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p> You have no notifications. </p>
            )}
        </div>
    );
}