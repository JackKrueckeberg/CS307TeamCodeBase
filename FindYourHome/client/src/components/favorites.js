import React, { useState, useEffect } from "react";
import '../Stylings/favorites.css';
import Modal from "react-modal";
import { useUser } from '../contexts/UserContext';
import { useNavigate } from "react-router";
import { useCity } from "../contexts/CityContext";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function Favorites() {
    
    const {user: userProfile } = useUser(); // the id of the current logged in user
    const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const storedLocUser = JSON.parse(localStorage.getItem('currentUser'));
    const [user, setInfo] = useState(storedSesUser || storedLocUser || userProfile);
    const [username, setUsername] = useState('');

    const [tabVal, setTabVal] = useState(1); // tabVal remembers which tabs are active
    const [favorite_searches, setFavoriteSearches] = useState([]);
    const [favorite_cities, setFavoriteCities] = useState([]);

    const [selectedCities, setSelectedCities] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [showShareModal, setShareModal] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [isExisting, setIsExisting] = useState(true);

    const {globalCity, setGlobalCity} = useCity();
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState(''); // successMessage will display when the user successfully updates their user info
    const [errorMessage, setError] = useState(''); // errorMessage will display when there is an error

    useEffect(() => {
        // Call the function to get favorite cities when the component mounts
        fetchUsername(user._id);
        getUser_favorite_cities();
        getUser_favorite_searches();
    }, []); 

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

            //console.log(resp.username);
    
            return resp.username;
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
    }


    const handleTabChange = (index) => {
        if(tabVal === 1) {
            getUser_favorite_searches();
        } else {
            getUser_favorite_cities();
        }
        setTabVal(index) // sets the state to whatever index the tab is
        //console.log(index);
    }

    async function getUser_favorite_searches() {

        const city_info = await fetch(`http://localhost:5050/users/${user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          window.alert(error);
          return;
        });
    
        const resp = await city_info.json();
        if (resp.favorite_searches) {
            setFavoriteSearches(resp.favorite_searches);
        }

        //console.log(resp.favorite_searches);
    
        return resp.favorite_searches;
    }

    async function removeFavoriteSearch(index) {
        var newFavs = [];
        for (var i = 0; i < favorite_searches.length; i++) {
            if (i != index) {
                newFavs.push(favorite_searches[i]);
            }
        }

        await fetch(`http://localhost:5050/favorite_searches/${user.email}`, {
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
    
    //console.log(favorite_searches);


    async function getUser_favorite_cities() {

        const city_info = await fetch(`http://localhost:5050/users/${user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          window.alert(error);
          return;
        });
    
        const resp = await city_info.json();

        if (resp.favorite_cities) {

            setFavoriteCities(resp.favorite_cities);

            setSelectedCities(Array.from({ length: resp.favorite_cities.length }, () => false));

        }

        //console.log(resp.favorite_cities);
    
        return resp.favorite_cities;
    }

    async function removeFavoriteCity(index) {
        var newFavs = [];
        for (var i = 0; i < favorite_cities.length; i++) {
            if (i != index) {
                newFavs.push(favorite_cities[i]);
            }
        }

        await fetch(`http://localhost:5050/favorite_cities/${user.email}`, {
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

    const handleCityButtonClick = async (cityName) => {

        const response = await fetch(`http://localhost:5050/city_info/${cityName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const resp = await response.json();

        if (response.status === 200) {
            setGlobalCity(resp);
            localStorage.setItem('selectedCity', JSON.stringify(resp));
            navigate(`/profile/favorite-city/citypage/${resp.name}`, resp);
            return resp;
        } else {
            alert("Something went wrong");
        }
    }

    /* Got this from preferences.js */
    /*const handleCity = async (value) => {
        for (var i = 0; i < favorite_cities.length; i++) {
          if (favorite_cities[i].name === value) {
            var tempCity = favorite_cities[i];
            setGlobalCity(favorite_cities[i]);
            navigate("/cityPage", favorite_cities[i]);
            return;
          }
        }
    }*/

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
        //console.log(selectedCities);
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
        const citiesToSend = favorite_cities.filter((city, index) => selectedCities[index]);
        const message = `Here are my favorite cities: ${citiesToSend.join(', ')}`;
        //console.log(message);

        const response = await fetch('http://localhost:5050/messageRoute/share-favorite-cities', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                senderUsername: username,
                recipientUsername: recipient,
                content: message,
                timeSent: new Date(),
                isList: true,
            }),
        });

        if (response.status === 200) {
            setSuccessMessage('Your favorites have been sent to ', recipient, '!');
            handleCancel();
            handleShareCancel();

            const response2 = await fetch('http://localhost:5050/notification/notify', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderUsername: username,
                    recipientUsername: recipient,
                    isMessage: true,
                    timeSent: new Date(),
                    city: '',
                }),
            });

            if (response2.status === 200) {             
                window.location.reload();
                return;
            } else {
                alert("something went wrong");
            }

            return;
        } else {
            setError('There was an error sending your favorites to ', recipient, '. Please try again.');
        }
    };

    const [form, setForm] = useLocalStorage("form", {
        population: "",
        east_coast: false,
        west_coast: false,
        central: false,
        mountain_west: false,
        state: "",
        zip_code: "",
        county: "",
        median_income: "",
        favorited: false,
        population_weight: 1,
        region_weight: 1,
        state_weight: 1,
        zip_weight: 1,
        county_weight: 1,
        income_weight: 1
      });

    const updateForm = (value) => {
        return setForm((prev) => {
        return { ...prev, ...value };
        });
    };

    console.log(useLocalStorage("form"));

    const handleFavoriteSearchRoute = (key) => {
        // set the local storage of the preferences
        updateForm(key);
        console.log(form);
        // navigate to the preferences page
        navigate("/profile/favorite-search/preferences");
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
        <div className="favs">
            <div className="tab-block">
                <div onClick={() => handleTabChange(1)} className={`${tabVal === 1 ? 'tab active-tab' : 'tab'}`}> Favorite Cities </div>
                <div className={`${tabVal === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => handleTabChange(2)}> Favorite Searches </div>
            </div>

            <div className="contents">
                
                <div className={`${tabVal === 1 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Cities </h2>
                    {favorite_cities.length > 0 ? (
                        <div>
                            {isSelecting ? (
                                <div>
                                    <div className="buttons">
                                        <button className="shareTo-button" onClick={handleShareModal}>Share</button>
                                        <button className="share-cancel" onClick={handleCancel}>Cancel</button>
                                    </div>
                                    <Modal
                                        className={"share-modal"}
                                        isOpen={showShareModal}
                                        onRequestClose={() => {
                                            setShareModal(false);
                                            setError('');
                                        }}
                                        contentLabel="Share Favorite Modal"
                                    >
                                        <div className="modal-content">
                                            <h2>Who do you wanna share your favorite cities with?</h2>
                                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                                            {successMessage && <p className="success-message">{successMessage}</p>}
                                            <h5>Selected Cities to Share:</h5>
                                            <ul className="city">
                                                {selectedCities.map((isSelected, index) => {
                                                    if (isSelected) {
                                                        return (
                                                            <li key={index}>
                                                                <span>{favorite_cities[index]}</span>
                                                                {/*{Object.entries(favorite_cities[index]).map(([key, value]) => (
                                                                    <span key={key}>
                                                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                                                    </span>
                                                                ))}*/}
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
                                            <button className="share-cancel" onClick={() => handleShareCancel()}>Cancel</button>
                                        </div>
                                    </Modal>
                                <ul className="city">
                                    {favorite_cities.map((city, index) => (
                                        <li key={index}>
                                            <input
                                                type="checkbox"
                                                name="selectedCity"
                                                checked={selectedCities[index]}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                            <span> {city} </span>
                                            {/*{Object.entries(city).map(([key, value]) => {
                            
                            
                                                return (
                                                    <span key={key}>
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                                    </span>
                                                );
                            
                           
                                             })}*/}
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
                                    <ul className="city">
                                        {favorite_cities.map((city, index) => (
                                            <li key={index}>
                                                <button onClick={() => removeFavoriteCity(index)}>delete</button>
                                                <button className="city-button" key={city} onClick={() => handleCityButtonClick(city)}>{city}</button>
                                                {/*{Object.entries(city).map(([key, value]) => {
                                                    console.log(city);
                                                    return (
                                                        <span key={key}>
                                                            {value}
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                                        </span>
                                                    );
                            
                           
                                                })}*/}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h5> No favorites cities yet </h5>
                            <p> Mark your favorite cities and you will always have them here!</p>
                        </div>
                    )}
                </div>

                <div className={`${tabVal === 2 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Searches </h2>
                    {favorite_searches.length > 0 ? (
                        <ul className="search">
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
                            <button className="city-button" onClick={() => handleFavoriteSearchRoute(search) }> Search </button>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <div>
                            <h5> No favorites searches yet </h5>
                            <p> Mark your favorite searches and you will always have them here!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}