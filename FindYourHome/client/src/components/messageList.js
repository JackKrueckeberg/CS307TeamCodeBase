import React, { useState, useEffect, useRef } from "react";
import { useUser } from '../contexts/UserContext';
import '../Stylings/messageBoard.css';
import Modal from "react-modal";

export default function MessageList() {
    const {user: userProfile } = useUser(); // the id of the current logged in user
    const [messageBoards, setMessageBoards] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedMessageBoard, setSelectedMessageBoard] = useState(null);

    const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const storedLocUser = JSON.parse(localStorage.getItem('currentUser'));

    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setError] = useState('');

    const [user, setInfo] = useState(storedSesUser || storedLocUser || userProfile);

    const [username, setUsername] = useState('');
    const [recipient, setRecipient] = useState('');
    const [inputRecipient, setInputRecipient] = useState('');
    const messageInputRef = useRef(); // Reference to the message input field
    const messagesRef = useRef(null); // reference to the messages in a message board
    const [newMessage, setNewMessage] = useState(""); // State to store the new message
    const [newBoardMessages, setNewBoardMessages] = useState([]);

    const [sentMessage, setSentMessage] = useState(false); // Boolean to keep track of new messages

    useEffect(() => {
        fetchUsername(user._id);
        fetchUserMessageBoards();

        const intervalId = setInterval(() => {
            fetchUserMessageBoards();
            console.log(sentMessage);
            if (sentMessage) {
                fetchUserMessages(selectedMessageBoard);
                setSentMessage(false);
            }

          }, 5000); // 5000 milliseconds = 5 seconds
      
          // The cleanup function to clear the interval when the component unmounts
          return () => {
            clearInterval(intervalId);
            setSelectedMessageBoard(null);
          };

    }, []);

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
            }

            console.log(resp.messageList);
    
            return resp.messageList;
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

    // get the messages that the user has
    const fetchUserMessages = async (messageBoard) => {
        const messagesWith = messageBoard.messagesWith;
        try {
            const response = await fetch(`http://localhost:5050/messageRoute/messages/${user._id}/${messagesWith}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            const resp = await response.json();

            setMessages(resp);

            console.log(resp);
    
            return resp;
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

     // function to check that the user exists
     const checkExistingUser = async (recipient) => {
        try {
            const response = await fetch(`http://localhost:5050/profileRoute/check-username/${recipient}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                return !data.isAvailable;
            }
        } catch (error) {
            console.error("Error checking username availability: ", error);
            return false;
        }
    };

    // function to send a message back
    const addMessageBoard = async (recipient) => {
        const exists = await checkExistingUser(recipient);
        if (!exists) {
            setError('The username you provided does not match any in our records. Please try again.');
            return;
        }

        console.log(username);

        console.log(recipient);

        // Check if a message board with the recipient already exists
        const existingMessageBoard = messageBoards.find((board) => board.messagesWith === recipient);

        if (existingMessageBoard) {
            // A message board with the recipient already exists; select it.
            handleSelectMessageBoard(existingMessageBoard);
            setShowModal(false);
            setInputRecipient('');
        } else {

            // Create a new message board and add it to the messageBoards state
            setNewBoardMessages([...newBoardMessages, `Hello! ${username} wants to start a conversation!`]);

            const response = await fetch('http://localhost:5050/messageBoard/create-board', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user1: username, 
                    user2: recipient,
                    time: new Date(),
                    messages: newBoardMessages,
                    hasNewMessage: true,
                }),
            });

            if (response.status === 200) {
                console.log(response);
                setShowModal(false);
                setInputRecipient('');
                window.location.reload();
                return;
            } else {
                alert('There was an error.');
            }
        }
    }

    const handleNewMessageBoard = () => {
        setShowModal(true);
    }

    const handleCancel = () => {
        setShowModal(false);
        setError('');
        setRecipient('');
    }

    const handleSelectMessageBoard = (messageBoard) => {
        if (messageBoard.hasNewMessage) {
            // Update the message board's state to mark the new message as read
            const updatedMessageBoards = messageBoards.map(board => {
                if (board.messagesWith === messageBoard.messagesWith) {
                    return { ...board, hasNewMessage: false };
                }
                return board;
            });
            setMessageBoards(updatedMessageBoards);
    
            // Add code to update the backend with the read status if needed
            updateMessageBoard(messageBoard);
        }


        setSelectedMessageBoard(messageBoard);
        setRecipient(messageBoard.messagesWith);
        fetchUserMessages(messageBoard);
        
        console.log(messages);

        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }

    const updateMessageBoard = async (messageBoard) => {
        console.log(messageBoard.messagesWith);
        const response = await fetch('http://localhost:5050/messageBoard/update-board', {
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

    // function to send a message back
    const sendMessage = async () => {
        console.log(newMessage);

        if (newMessage && recipient !== "") {

            const messageData = {
                senderUsername: username,
                recipientUsername: recipient,
                content: newMessage,
                timeSent: new Date(),
            };

            const response = await fetch('http://localhost:5050/messageRoute/share-favorite-cities', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderUsername: username,
                    recipientUsername: recipient,
                    content: newMessage,
                    timeSent: new Date(),
                }),
            });

            if (response.status === 200) {             
                setNewMessage(""); // Clear the input field
                messageInputRef.current.value = "";
                setSentMessage(true);
                window.location.reload();
                return;
            } else {
                alert("something went wrong");
            }

        } else {
            alert("no recipient");
        }
    }

    return (
        <div>
            <h2> Here are your Messages </h2>
            <div className="buttons">
                <button className="share-button" onClick={() => handleNewMessageBoard(recipient)}>New Message</button>
            </div>
            <Modal
                className={"share-modal"}
                isOpen={showModal}
                onRequestClose={() => {
                    setShowModal(false);
                    setError('');
                }}
                contentLabel="Share Favorite Modal"
            >
                <div className="modal-content">
                    <h2>Who do you want to start a conversation with?</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input
                            type="username"
                            placeholder="Recipient's username"
                            value={inputRecipient}
                            onChange={(e) => {setRecipient(e.target.value); setInputRecipient(e.target.value);}}
                        />
                    <button className="share-button" onClick={() => addMessageBoard(recipient)}>Start Message</button>
                    <button className="cancel-button" onClick={() => handleCancel()}>Cancel</button>
                </div>
            </Modal>

            {messageBoards.length > 0 ? (
                <ul className="message-list scrollable">
                    {messageBoards.map((messageBoard, index) => (
                        <button
                            key={index}
                            className={`message ${messageBoard.hasNewMessage ? 'new-message' : ''}`}
                            onClick={() => handleSelectMessageBoard(messageBoard)}
                        >
                            <p className="message-sender">{messageBoard.messagesWith}</p>
                            <p className="message-timestamp">{new Date(messageBoard.time).toLocaleString()}</p>
                        </button>
                    ))}
                </ul>
            ) : (
                <p> You have no messages. Click "New Message" to start a new message with someone!</p>
            )}

            {/* Render a modal or a separate page for viewing messages */}
            {selectedMessageBoard && (
                <div>
                    <div className="message-board-container">
                        <h2>Messages with<span>{selectedMessageBoard.messagesWith}</span></h2>
                        <ul className="message-board scrollable" ref={messagesRef}>
                            {messages.map((message, index) => (
                                <li
                                    key={index}
                                    className={`message ${username === message.sender ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content-container">
                                        <p className="message-sender">{message.sender}</p>
                                        <div className={`message-content ${username === message.sender ? 'sent' : 'received'}`}>
                                            <p>{message.content}</p>
                                        </div>
                                        <p className="message-timestamp">{new Date(message.timeSent).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
    
                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                ref={messageInputRef}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={() => sendMessage()}>Send</button>
                        </div>
                    </div>
                    {/* Add a button or link to go back to the list of message boards */}
                    <button onClick={() => setSelectedMessageBoard(null)}>Back to Message List</button> 
                </div>
            )}
        </div>
    )

};