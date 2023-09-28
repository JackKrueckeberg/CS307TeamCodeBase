import React, { useState } from "react";
import './profile.css';
import { FaUser, FaEdit } from 'react-icons/fa';

export default function Profile() {
    // initialize the profile info
    const initialInfo = {
        name: 'First and Last Name',
        username: 'Your UserName',
        email: 'Your Email',
        bio: 'Your Bio',
        password: '',
    };

    // Create state variables for user info ad editing mode
    const [user, setInfo] = useState(initialInfo); // user stores the profile info
    const [isEditing, setIsEditing] = useState(false); // isEditing tracks whether the user is in edit mode

    // function to toggle between view and edit mode
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    // function to handle input changes and update the user state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfo({
            ...user,
            [name]: value,
        });
    };

    // function to save changes and exit edit mode
    const handleSave = () => {
        setIsEditing(false);
    };

    // function to change password
    const handlePasswordChange = () => {
        // route the user to change password function
      };

    // function to display favorite cities


    // function to display favorite searches


    
    return (
        <div className="profile">
            <div class="tab-container">
                <ul class="tabs">
                    <li><a href="Favorite Cities">Favorite Cities</a></li>
                    <li><a href="Favorite Searches">Favorite Searches</a></li>
                </ul>
                <div id="tab1" class="tab-content">Content for Favorite Cities</div>
                <div id="tab2" class="tab-content">Content for Favorite Searches</div>
            </div>
            <div className="profile-header">
                <div className="profile-avatar">
                    <FaUser size={64} />
                </div>
                <div className="profile-name">
                    {isEditing ? (
                        <input
                            class = "round-corner"
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <h1>{user.name}</h1>
                    )}
                </div>
                <div className="profile-actions">
                    {isEditing ? (
                        <button class="round-corner" onClick={handleSave}>Save</button>
                    ) : (
                        <button class="round-corner" onClick={handleEdit}>
                            <FaEdit /> Edit
                        </button>
                    )}
                </div>
            </div>
            <div className="profile-details">
                <p className="profile-username">
                    <strong> Username: </strong> {isEditing ? (
                    <input
                        class = "round-corner"
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                    />
                    ) : (
                        user.username
                    )}
                </p>
                <p className="profile-email">
                    <strong> Email: </strong>{isEditing ? (
                        <input
                            class = "round-corner"
                            type="text"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                        />
                    ) : (
                        user.email
                    )}
                </p>
                <p className="profile-password">
                    <strong>Password:</strong>
                    <button class="round-corner" onClick={handlePasswordChange}>Change Password</button>
                </p>
                <p className="profile-bio">
                    <strong> Bio: </strong> {isEditing ? (
                        <textarea
                            class = "round-corner"
                            name="bio"
                            value={user.bio}
                            onChange={handleInputChange}
                        />
                    ) : (
                        user.bio
                    )}
                </p>
            </div>
        </div>
    );
};