import React, { useState, useEffect } from "react";
import '../Stylings/accountInfo.css';
import Favorites from './favorites.js';
import { FaEdit } from 'react-icons/fa';
import defaultImage from '../Stylings/Default_Profile_Picture.png';
import { useUser } from '../contexts/UserContext';
import Modal from "react-modal";

export default function AccountInfo() {
    const initialInfo = {
        username: '',
        firstName: '',
        lastName: '',
        bio: '',
        email: '',
        password: '',
    };

    // Create state variables for user info ad editing mode
    const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const storedLocUser = JSON.parse(localStorage.getItem('currentUser'));

    const {user: userProfile } = useUser(); // the id of the current logged in user
    const [user, setInfo] = useState( storedSesUser || storedLocUser || userProfile || initialInfo);

    const [isEditing, setIsEditing] = useState(false); // isEditing tracks whether the user is in edit mode
    const [prevUser, setPrevUser] = useState(initialInfo); // Store a copy of user data to revert if editing is canceled
    const [profile_image, setImage] = useState(defaultImage); // image keeps track of the user's profile image
    const fileInputRef = React.createRef();
    const [successMessage, setSuccessMessage] = useState(''); // successMessage will display when the user successfully updates their user info
    const [errorMessage, setError] = useState(''); // errorMessage will display when there is an error
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // password change pop-up
    const [newPassword, setNewPassword] = useState(''); //new password
    const [confirmPassword, setConfirmPassword] = useState(''); //confirm new password
    const [oldPassword, setOldPassword] = useState(''); //old password
    const [checkOldPassword, setCheckOldPassword] = useState(''); //check the old password
    const [requirementsMet, setRequirementsMet] = useState({
        minLength: false,
        specialChar: false,
        capitalLetter: false,
        lowerCaseLetter: false,
        numeral: false,
    });


    useEffect(() => {
        // fetch user data from the backend when the component mounts
        fetchUserInfo();
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
                setInfo({
                    ...user,
                    bio: userInfo.bio,
                    email: userInfo.email,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    password: userInfo.password,
                    profile_image: userInfo.profile_image,
                    username: userInfo.username,
                });
                // Update the user state with the fetched data
                if (userInfo.profile_image === "") {
                    setImage(defaultImage);
                    setInfo({
                        ...user,
                        bio: userInfo.bio,
                        email: userInfo.email,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        password: userInfo.password,
                        profile_image: defaultImage,
                        username: userInfo.username,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }

    // function to toggle between view and edit mode
    const handleEdit = () => {
        console.log(user);
        // Store a copy of user data before editing
        setPrevUser(user);
        setIsEditing(!isEditing);
    };

    // function to handle password changes
    const handlePasswordChange = () => {
        setShowChangePasswordModal(true);
    }

    // Function to test minimum length of a password
    const hasMinLength = (password) => {
        return password.length >= 8;
    }

    // Function to check for speacial characters in the password
    const hasSpecialCharacters = (password) => {
        const specialCharacters = /[!@#$%&*]/; 
        return specialCharacters.test(password);
    }

    // Function to check for capital letters in the password
    const hasCapitalLetters = (password) => {
        const capitalLetters = /[A-Z]/;
        return capitalLetters.test(password);
    }

    // Function to check for lower case letters in the password
    const hasLowerCase = (password) => {
        const lowerCase = /[a-z]/;
        return lowerCase.test(password);
    }

    // Function to check for the numeral in the password
    const hasNumeral = (password) => {
        const numeral = /[0-9]/;
        return numeral.test(password);
    }

    // Function to check that the password requirements were met
    const checkPasswordRequirements = (password) => {
        setRequirementsMet((prevRequirements) => ({
            ...prevRequirements,
            minLength: hasMinLength(password),
            specialChar: hasSpecialCharacters(password),
            capitalLetter: hasCapitalLetters(password),
            lowerCaseLetter: hasLowerCase(password),
            numeral: hasNumeral(password),
        }));
    }

    // Function to save the new password
    const saveNewPassword = async () => {
        if (oldPassword !== user.password) {
            setError("That password does not match our records. Please try again.");
            return;
        }
        if (oldPassword === newPassword) {
            setError("New password cannot be the same as the old password. Please try again.");
            return;
        }


        if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        if (!hasMinLength(newPassword)) {
            setError('New password must have a minimum of 8 characters.');
            return;
        }

        if (!hasCapitalLetters(newPassword) || !hasSpecialCharacters(newPassword) || !hasNumeral(newPassword) || !hasLowerCase(newPassword)) {
            setError('New password is not strong enough. Make sure your new password meets the passsword requirements.')
            return;
        }

        //TODO save to the backend
        try {
            const response = await fetch(`http://localhost:5050/profileRoute/update-password/${user._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: newPassword }),
            });

            console.log(newPassword);

            if (response.status === 200) {
                const data = await response.json();
                console.log(data.message);
                setSuccessMessage('Password updated successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000); // Clear the message after 5 seconds
            } else {
                console.error("Password update failed");
            }
        } catch (error) {
            console.error("Error updating password:", error);
        }

        console.log("New Password:", newPassword);
        handlePasswordCancel();
    }

    const handlePasswordCancel = () => {
        setShowChangePasswordModal(false);
        setRequirementsMet({
            minLength: false,
            specialChar: false,
            capitalLetter: false,
            lowerCaseLetter: false,
            numeral: false,
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
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
        if (prevUser.username !== user.username && isUsernameAvailable === false) {
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
                return data.isAvailable;
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
        console.log(isUsernameAvailable);

        if (prevUser.username !== user.username && isUsernameAvailable === false) {
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
        };

        try {
            // Send a PATCH request to the server
            const response = await fetch(`http://localhost:5050/profileRoute/update-info/${user._id}`, {
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
    const handleImageUpload = async (e) => {
        console.log(e.target.files);
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);
            //console.log(imageURL);
            try {
                // Send a PATCH request to the server
                const response = await fetch(`http://localhost:5050/profileRoute/update-image/${user._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ profile_image: profile_image }),
                });
    
                const data = await response.json();
    
                if (response.status === 200) {
                    console.log(data.message);
                    setSuccessMessage('Profile Image updated successfully');
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 5000); // Clear the message after 5 seconds
                }
    
            } catch (error) {
                console.error("There was an error updating your info: ", error);
            }
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
                    onRequestClose={() => {
                        setShowChangePasswordModal(false);
                        setError('');
                    }}
                    contentLabel="Change Password Modal"
                >
                    <div className="modal-content">
                        <h2>Password Change</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <p>Password requirements:</p>
                        <ul>
                            <li className={requirementsMet.minLength ? 'fulfilled' : 'unfulfilled'}>Minimum of 8 characters</li>
                            <li className={requirementsMet.specialChar ? 'fulfilled' : 'unfulfilled'}>At least one special character [!@#$%^&*]</li>
                            <li className={requirementsMet.capitalLetter ? 'fulfilled' : 'unfulfilled'}>At least one capital letter [A-Z]</li>
                            <li className={requirementsMet.lowerCaseLetter ? 'fulfilled' : 'unfulfilled'}>At least one lower case letter [a-z]</li>
                            <li className={requirementsMet.numeral ? 'fulfilled' : 'unfulfilled'}>At least one numeral [0-9]</li>
                        </ul>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                checkPasswordRequirements(e.target.value);
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className="save-button" onClick={() => saveNewPassword(newPassword)}>Save Password</button>
                        <button className="cancel-button" onClick={() => handlePasswordCancel()}>Cancel</button>
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