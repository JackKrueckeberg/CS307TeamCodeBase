import React, { useState, useEffect } from "react";
import { useUser } from '../contexts/UserContext';
import Modal from "react-modal";
import '../Stylings/notification.css';

export default function MessageNotification() {
    const {user: userProfile } = useUser(); // the id of the current logged in user
    const [messageBoards, setMessageBoards] = useState([]);

    const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const storedLocUser = JSON.parse(localStorage.getItem('currentUser'));

    const [user, setInfo] = useState(storedSesUser || storedLocUser || userProfile);
    const [username, setUsername] = useState('');

    const [notification, setNotification] = useState('');
    const [notificationModal, setNotificationModal] = useState(false);

    useEffect(() => {
        fetchUsername(user._id);
        const intervalId = setInterval(() => {
            fetchUserMessageBoards();
          }, 5000); // 5000 milliseconds = 5 seconds
      
          // The cleanup function to clear the interval when the component unmounts
          return () => {
            clearInterval(intervalId);
          };

    }, []);

    const closeNotification = () => {
        setNotificationModal(false);
    };

    // get the current user's username
    const fetchUsername = async (id) => {
        try {
            const response = await fetch(`http://localhost:5050/profileRoute/profile/${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            const resp = await response.json();

            setUsername(resp.username);

            console.log(resp.username);
    
            return resp.username;
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

    // get the messages that the user has
    const fetchUserMessageBoards = async () => {
        try {
            const response = await fetch(`http://localhost:5050/messageRoute/messages/${user._id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            const resp = await response.json();

            if (resp.messageList) {
                setMessageBoards(resp.messageList);

                const found = resp.messageList.find(
                    (entry) => entry.hasNewMessage === true && entry.sentNotification === false
                );

                if (found) {
                    updateMessageBoard(found);    
                    setNotificationModal(true);
                    setNotification(`You have a new message from ${found.messagesWith}.`);
                        
                    // Set a timeout to hide the notification after 8 seconds
                    setTimeout(() => {
                        setNotification('');
                        setNotificationModal(false);
                    }, 8000);
                }
            }

            console.log(resp.messageList);
    
            return resp.messageList;
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

    const updateMessageBoard = async (messageBoard) => {
        console.log(messageBoard.messagesWith);
        const response = await fetch('http://localhost:5050/messageBoard/update-board-notify', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                messagesWith: messageBoard.messagesWith,
            }),
        });

        if (response.status === 200) {            
            return;
        } else {
            alert("Something went wrong");
        }
    }

    return (
        <Modal 
            className="notification-modal"
            isOpen={notificationModal}
            onRequestClose={() => {
                setNotificationModal(false); 
            }}
            contentLabel="Notification Modal"
        >
            <div className="notification-content">{notification}</div>
            <button className="close-button" onClick={closeNotification}>Close</button>
        </Modal>
    )
};