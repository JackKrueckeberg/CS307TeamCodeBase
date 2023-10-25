import React, { useState, useEffect } from "react";
import '../Stylings/favorites.css';
import Modal from "react-modal";
import { useUser } from "../contexts/UserContext";


export default function Favorites() {

    const {user: userProfile} = useUser();
    
    const [tabVal, setTabVal] = useState(1); // tabVal remembers which tabs are active
    const [favorite_searches, setFavoriteSearches] = useState([]);
    const [favorite_cities, setFavoriteCities] = useState([]);

    const [selectedCities, setSelectedCities] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [showShareModal, setShareModal] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [isExisting, setIsExisting] = useState(true);

    const [successMessage, setSuccessMessage] = useState(''); // successMessage will display when the user successfully updates their user info
    const [errorMessage, setError] = useState(''); // errorMessage will display when there is an error

    useEffect(() => {
        // Call the function to get favorite cities when the component mounts
        getUser_favorite_cities();
    }, []); 

    const handleTabChange = (index) => {
        if(tabVal === 1) {
            getUser_favorite_searches();
        } else {
            getUser_favorite_cities();
        }
        setTabVal(index) // sets the state to whatever index the tab is
        console.log(index);
    }

    async function getUser_favorite_searches() {

        const city_info = await fetch(`http://localhost:5050/users/${userProfile.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          window.alert(error);
          return;
        });
    
        const resp = await city_info.json();

        setFavoriteSearches(resp.favorite_searches);

        console.log(resp.favorite_searches);
    
        return resp.favorite_searches;
    }

    async function removeFavoriteSearch(index) {
        var newFavs = [];
        for (var i = 0; i < favorite_searches.length; i++) {
            if (i != index) {
                newFavs.push(favorite_searches[i]);
            }
        }

        await fetch(`http://localhost:5050/favorite_searches/${userProfile.email}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({favorite_searches: newFavs})
          }).catch((error) => {
            window.alert(error);
            return;
          });

        setFavoriteSearches(newFavs);
    }
    
    console.log(favorite_searches);


    async function getUser_favorite_cities() {

        const city_info = await fetch(`http://localhost:5050/users/${userProfile.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          window.alert(error);
          return;
        });
    
        const resp = await city_info.json();

        setFavoriteCities(resp.favorite_cities);

        setSelectedCities(Array.from({ length: resp.favorite_cities.length }, () => false));

        console.log(resp.favorite_cities);
    
        return resp.favorite_cities;
    }

    async function removeFavoriteCity(index) {
        var newFavs = [];
        for (var i = 0; i < favorite_cities.length; i++) {
            if (i != index) {
                newFavs.push(favorite_cities[i]);
            }
        }

        await fetch(`http://localhost:5050/favorite_cities/${userProfile.email}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({favorite_cities: newFavs})
          }).catch((error) => {
            window.alert(error);
            return;
          });

        setFavoriteCities(newFavs);
    }

    // function to toggle between view and select mode
    const handleSelect = () => {
        setIsSelecting(!isSelecting);
    };

    // function to toggle between select and view mode
    const handleCancel = () => {
        setSelectedCities(Array.from({ length: selectedCities.length }, () => false));
        setIsSelecting(false);
    };

    // function to toggle the checkbox
    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...selectedCities]; // Create a copy of the selectedCities array
        updatedCheckboxes[index] = !updatedCheckboxes[index]; // Toggle the value at the clicked index
        setSelectedCities(updatedCheckboxes); // Update the state
    };

    // function to share selected cities
    const handleShareModal = () => {
        const isAnyCitySelected = selectedCities.some((isSelected) => isSelected); // Checks if there is at least one value in selected Cities that is true
        if (!isAnyCitySelected) {
            alert("You need to select a city to share.");
            return;
        }

        setShareModal(true);
        console.log(selectedCities);
    }

    const handleShareCancel = () => {
        setShareModal(false);
        setError('');
        setRecipient('');
    }

    // function to share selected cities with the another user
    const handleShare = async (recipient) => {
        const exists = await checkExistingUser(recipient);
        if (!exists) {
            setError('The username you provided does not match any in our records. Please try again.');
            return;
        }

        // TODO finish the send method

    };

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
   


    return (
        <div className="container">
            <div className="tabs-block">
                <div onClick={() => handleTabChange(1)} className={`${tabVal === 1 ? 'tab active-tab' : 'tab'}`}> Favorite Cities </div>
                <div className={`${tabVal === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => handleTabChange(2)}> Favorite Searches </div>
            </div>

            <div className="contents">
                
                <div className={`${tabVal === 1 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Cities </h2>
                    {isSelecting ? (
                        <div>
                            <div className="buttons">
                                <button className="shareTo-button" onClick={handleShareModal}>Share to</button>
                                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                            </div>
                            <Modal
                                className={"password-change-modal"}
                                isOpen={showShareModal}
                                onRequestClose={() => {
                                    setShareModal(false);
                                    setError('');
                                }}
                                contentLabel="Change Password Modal"
                >
                                <div className="modal-content">
                                    <h2>Who do you wanna share your favorite cities with?</h2>
                                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                                    <h5>Selected Cities to Share:</h5>
                                    <ul>
                                    {selectedCities.map((isSelected, index) => {
                                        if (isSelected) {
                                            return (
                                                <li key={index}>
                                                    {Object.entries(favorite_cities[index]).map(([key, value]) => (
                                                        <span key={key}>
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                                        </span>
                                                    ))}
                                                </li>
                                            );
                                        }
                                    })}
                                    </ul>
                                    <input
                                        type="username"
                                        placeholder="Recipient's username"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                    />
                                    <button className="share-button" onClick={() => handleShare(recipient)}>Share</button>
                                    <button className="cancel-button" onClick={() => handleShareCancel()}>Cancel</button>
                                </div>
                            </Modal>
                            <ul>
                            {favorite_cities.map((city, index) => (
                                <li key={index}>
                                <input
                                    type="checkbox"
                                    name="selectedCity"
                                    checked={selectedCities[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                {Object.entries(city).map(([key, value]) => {
                            
                            
                                    return (
                                        <span key={key}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                        </span>
                                    );
                            
                           
                                })}
                                </li>
                            ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="view">
                            <div className="buttons">
                                <button className="share-favorite" onClick={handleSelect}>Share Favorite</button>
                            </div>
                            {/*{getUser_favorite_cities}*/}
                            <ul>
                            {favorite_cities.map((city, index) => (
                                <li key={index}>
                                <button onClick={() => removeFavoriteCity(index)}>delete</button>
                                {Object.entries(city).map(([key, value]) => {
                            
                            
                                    return (
                                        <span key={key}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                        </span>
                                    );
                            
                           
                                })}
                                </li>
                            ))}
                            </ul>
                        </div>
                    )}
                    
                    

                </div>

                <div className={`${tabVal === 2 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Searches </h2>
                    <ul>
                    {favorite_searches.map((search, index) => (
                        <li key={index}>
                        <button onClick={() => removeFavoriteSearch(index)}>delete</button>
                        {Object.entries(search).map(([key, value]) => {
                            if (value !== null && value !== "" && value !== false) {
                            if (key === 'state' && value === 'default') {
                                return null; // Don't display State: default
                            }
                            return (
                                <span key={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                </span>
                            );
                            }
                            return null; // Don't display if the field is not populated
                        })}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}