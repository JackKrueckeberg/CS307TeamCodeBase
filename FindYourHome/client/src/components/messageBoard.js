import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    // Create a new message object with user info and message content
    const message = {
      user: 'User1', // Replace with actual user data
      content: newMessage,
    };

    // Add the message to the state
    setMessages([...messages, message]);

    // Clear the input field
    setNewMessage('');
  };

  return (
    <div>
      <div className="message-display">
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessageBoard;
