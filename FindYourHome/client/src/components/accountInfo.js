import React, { useState, useEffect } from "react";
import '../Stylings/accountInfo.css';
import Favorites from './favorites.js';
import { FaEdit } from 'react-icons/fa';
import defaultImage from '../Stylings/Default_Profile_Picture.png';
import { useUser } from '../contexts/UserContext';
import Modal from "react-modal";

export default function AccountInfo() {
    // initialize the profile info
    const initialInfo = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        bio: '',
        profile_image: '',
        password: '',
    };

    // Create state variables for user info ad editing mode
    const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const storedLocUser = JSON.parse(localStorage.getItem('currentUser'));

    const {user: userProfile } = useUser(); // the id of the current logged in user
    const [user, setInfo] = useState(storedSesUser || storedLocUser || userProfile || initialInfo);
    const [isEditing, setIsEditing] = useState(false); // isEditing tracks whether the user is in edit mode
    const [prevUser, setPrevUser] = useState(initialInfo); // Store a copy of user data to revert if editing is canceled
    const [profile_image, setImage] = useState(defaultImage); // image keeps track of the user's profile image
    const fileInputRef = React.createRef();
    const [successMessage, setSuccessMessage] = useState(''); // successMessage will display when the user successfully updates their user info
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // password change pop-up
    const [newPassword, setNewPassword] = useState(''); //new password
    const [confrimPassword, setConfirmPassword] = useState(''); //confirm new password
    const oldPassword = user.password; //old password
    const [checkOldPassword, setCheckOldPassword] = useState(''); //check the old password


    useEffect(() => {
        // fetch user data from the backend when the component mounts
        fetchUserInfo();
    }, []);
    // fetch the user data from the backend
    const fetchUserInfo = async () => {
        try {

            console.log(`This is value of user ${user._id}`);
            const response = await fetch(`http://localhost:5050/profileRoute/${user._id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            if (response.status === 200) {
                const userInfo = await response.json();
                console.log(userInfo);
                setInfo(userInfo); // Update the user state with the fetched data
                if (userInfo.profile_image === "") {
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
        // Store a copy of user data before editing
        setPrevUser(user);
        setIsEditing(!isEditing);
    };

    // function to handle password changes
    const handlePasswordChange = () => {
        setShowChangePasswordModal(true);
    }

    // Function to save the new password
    const saveNewPassword = () => {
        // You can add logic to send the new password to your backend
        // and update it in the database.

        // For now, let's just log the new password:
        console.log("New Password:", newPassword);
    }

    // function to handle input changes and update the user state
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'username') {
            checkUsernameAvailability(value);
        }

        setInfo({
            ...user,
            [name]: value,
        });
    };

    // function to save changes and exit edit mode
    const handleSave = () => {
        if (prevUser.username !== user.username && !isUsernameAvailable) {
            alert('Username is already taken. Please choose a different one.');
            setInfo(prevUser);
            return;
          }

        setIsEditing(false)
        saveChanges();
    };

    //function to cancel editing and exit edit mode
    const handleCancel = () => {
        // if something was changed, revert back to previous
        setInfo(prevUser);
        setIsEditing(false);
    }

    // Function to check username availability on the server
    const checkUsernameAvailability = async (newUsername) => {
        try {
            const response = await fetch(`http://localhost:5050/profileRoute/check-username/${newUsername}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                return !data.isUsernameTaken;
            }

            return false;
        } catch (error) {
            console.error("Error checking username availability: ", error);
            return false;
        }
    }; 

    // function to submit the changes to the database
    const saveChanges = async (e) => {
        // Check if the new username is available
        const isUsernameAvailable = await checkUsernameAvailability(user.username);

        if (prevUser.username !== user.username && !isUsernameAvailable) {
            alert('Username is already taken. Please choose a different one.');
            setInfo(prevUser);
            return;
        }

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
            const response = await fetch(`http://localhost:5050/profileRoute/${user._id}`, {
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
                sessionStorage.setItem("currentUser", JSON.stringify(userInfo));
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
    // TODO fix this 
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
            console.log(user.profile_image);
        }
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
                        <div>
                            <button className="save-button" onClick={handleSave}>Save</button>
                            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                        </div>
                    ) : (
                        <button className="edit-button" onClick={handleEdit}>
                            <FaEdit size={38}/> Edit
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

                {/* Password Change Modal */}
                <Modal
                    className={"password-change-modal"}
                    isOpen={showChangePasswordModal}
                    onRequestClose={() => setShowChangePasswordModal(false)}
                    contentLabel="Change Password Modal"
                >
                    <div className="modal-content">
                        <h2>Password Change</h2>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={newPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className="save-button" onClick={() => saveNewPassword(newPassword)}>Save Password</button>
                        <button className="cancel-button" onClick={() => setShowChangePasswordModal(false)}>Cancel</button>
                    </div>
                </Modal>

                {/* Profile Bio*/}
                <p className="profile-bio">
                    <strong> Bio: </strong> {isEditing ? (
                        <textarea
                            className = "round-corner"
                            placeholder="Tell us about yourself"
                            name="bio"
                            value={user.bio}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <div className="bordered-section">
                            <span placeholder="Tell us about yourself">{user.bio}</span>
                        </div>
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