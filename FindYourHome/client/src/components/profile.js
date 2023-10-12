import React, { useState, useEffect } from "react";
import '../Stylings/profile.css';
import Favorites from './favorites.js';
import { FaEdit } from 'react-icons/fa';
import defaultImage from '../Stylings/Default_Profile_Picture.png';
import { useUser } from '../contexts/UserContext';

export default function Profile() {
    // initialize the profile info
    const initialInfo = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        bio: 'Enter Bio Here',
        profile_image: '',
        password: '',
    };

    // Create state variables for user info ad editing mode
    const [user, setInfo] = useState(initialInfo); // user stores the profile info
    const [isEditing, setIsEditing] = useState(false); // isEditing tracks whether the user is in edit mode
    const [profile_image, setImage] = useState(defaultImage); // image keeps track of the user's profile image
    const fileInputRef = React.createRef();
    const [successMessage, setSuccessMessage] = useState(''); // successMessage will display when the user successfully updates their user info
    const {user : userID, setLoggedInUser } = useUser(); // the id of the current logged in user

    //let user_id = userID._id;

    useEffect(() => {
        // fetch user data from the backend when the component mounts
        fetchUserInfo();
    }, []);

    // fetch the user data from the backend
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:5050/profileRoute/65286646184b42dec3d76364`, { //${user_id}
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            if (response.status === 200) {
                const userInfo = await response.json();
                console.log(userInfo);
                setInfo(userInfo); // Update the user state with the fetched data
                if (userInfo.profile_image == "") {
                    setInfo({
                        ...user,
                        profile_image: defaultImage,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

    // function to toggle between view and edit mode
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    // function to handle password changes
    const handlePasswordChange = (e) => {
        
    }

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
        setIsEditing(false)
        saveChanges();
    };

    // function to submit the changes to the database
    const saveChanges = async (e) => {
        const userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profile_image: profile_image,
            password: user.password,
        };

        try {
            // Send a PATCH request to the server
            const response = await fetch(`http://localhost:5050/profileRoute/65286646184b42dec3d76364`, { //${user_id}
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });

            const data = await response.json();

            if (response.status === 200) {
                console.log(data.message);
                setSuccessMessage('Profile updated successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000); // Clear the message after 5 seconds
            }

        } catch (error) {
            console.error("There was an error updating your info: ", error);
        }
    }

    const openFileInput = () => {
        fileInputRef.current.click();
    };

    // function to edit the profile image
    const handleImageUpload = (e) => {
        console.log(e.target.files);
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            console.log(imageURL);
            setImage(imageURL);
            setInfo({
                ...user,
                profile_image: imageURL,
            });
            console.log(profile_image);
        }
        saveChanges();
    };

    return (
        <div className="profile">
            <div className="profile-header">

                {/* Profile Picture */}
                <div className="profile-avatar">
                    <img src={profile_image} width={150} height={150} alt="Profile"/>
                    <button className="upload-image" onClick={openFileInput}>Upload Image</button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                </div>

                {/* User's Name divided into first and last name */}
                <div className="profile-name">
                    {isEditing ? (
                        <div>
                            <input
                                className = "round-corner"
                                type="text"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleInputChange}
                            />
                            <input
                                className = "round-corner"
                                type="text"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                    ) : (
                        <h2>{user.firstName} {user.lastName}</h2>
                    )}
                </div>

                {/* Edit Profile and Save Changes */}
                <div className="profile-actions">
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {isEditing ? (
                        <button className="round-corner" onClick={handleSave}>Save</button>
                    ) : (
                        <button className="edit-button" onClick={handleEdit}>
                            <FaEdit size={35}/> Edit
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
                        className = "round-corner"
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                    />
                    ) : (
                        <span className="bordered-section">{user.username}</span>
                    )}
                </p>

                {/* Profile Email */}
                <p className="profile-email">
                    <strong> Email: </strong>{isEditing ? (
                        <input
                            className = "round-corner"
                            type="text"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span className="bordered-section">{user.email}</span>
                    )}
                </p>

                {/* Profile Password */}
                <p className="profile-password">
                    <strong>Password:</strong>
                    <button className="change-password" onClick={handlePasswordChange}>Change Password</button>
                </p>

                {/* Profile Bio*/}
                <p className="profile-bio">
                    <strong> Bio: </strong> {isEditing ? (
                        <textarea
                            className = "round-corner"
                            name="bio"
                            value={user.bio}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span className="bordered-section">{user.bio}</span>
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