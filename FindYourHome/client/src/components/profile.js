import React, { useState } from "react";
import '../Stylings/profile.css';
import Favorites from './favorites.js';
import { FaUser, FaEdit } from 'react-icons/fa';

export default function Profile() {
    // initialize the profile info
    const initialInfo = {
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'Your Username',
        email: 'Your Email',
        bio: 'Your Bio',
        password: '',
    };

    // Create state variables for user info ad editing mode
    const [user, setInfo] = useState(initialInfo); // user stores the profile info
    const [isEditing, setIsEditing] = useState(false); // isEditing tracks whether the user is in edit mode
    const [image, setImage] = useState(); // image keeps track of the user's profile image

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

    // function to edit the profile image
    const handleImageUpload = (e) => {
        console.log(e.target.files);
        setImage(URL.createObjectURL(e.target.files[0]))
    };

    return (
        <div className="profile">
            <div className="profile-header">

                {/* Profile Picture */}
                {/* Not final implementation just a filler until I can figure out a better way */}
                <div>
                    {isEditing ? (
                        <input class="rounded-corner" type="file" name="Upload Image" onChange={handleImageUpload} />
                    ) : (
                        <img className="rounded-corner" src={image} width={150} height={150}/>
                    )}
                </div>

                {/* User's Name divided into first and last name */}
                <div className="profile-name">
                    {isEditing ? (
                        <input
                            class = "round-corner"
                            type="text"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <h2>{user.firstName}</h2>
                    )}
                    {isEditing ? (
                        <input
                            class = "round-corner"
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <h2>{user.lastName}</h2>
                    )}
                </div>

                {/* Edit Profile and Save Changes */}
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

            {/* Profile Details such as username, password, and bio */}
            <div className="profile-details">

                {/* Profile Username */}
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

                {/* Profile Email */}
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

                {/* Profile Password */}
                <p className="profile-password">
                    <strong>Password:</strong>
                    <button class="round-corner" onClick={handlePasswordChange}>Change Password</button>
                </p>

                {/* Profile Bio*/}
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

            {/* Profile Favorites Tabs */}
            <div className="tabs">
                <Favorites />
            </div>
        </div>
    );
};