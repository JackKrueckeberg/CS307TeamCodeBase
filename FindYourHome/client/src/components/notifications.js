import React, { useState, useEffect } from "react";
import { useUser } from '../contexts/UserContext';
import '../Stylings/notifications.css';

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

    async function removeNotification(index) {
        var newNots = [];
        for (var i = 0; i < notifications.length; i++) {
            if (i != index) {
                newNots.push(notifications[i]);
            }
        }

        await fetch(`http://localhost:5050/notification/${user._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({notifications: newNots})
          }).catch((error) => {
            window.alert(error);
            return;
          });

        setNotifications(newNots);
    }


    return (
        <div className="notification-content">
            {notifications.length > 0 ? (
                <ul className="notifications-list scrollable">
                    {notifications.map((note, index) => (
                        <li
                            key={index}
                            className="not-col"
                        >
                            <div className="notification">
                                <div className="notification-message">{note.content}</div>
                                <p className="notification-timestamp">{new Date(note.time).toLocaleString()}</p>
                            </div>
                            <button onClick={() => removeNotification(index)} className="removeNote">Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p> You have no notifications. </p>
            )}
        </div>
    );
}