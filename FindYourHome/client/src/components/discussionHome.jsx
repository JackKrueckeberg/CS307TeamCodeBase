import React, { useState, useEffect } from 'react';
import styles from '../Stylings/discussionStyle.module.css';
import DiscussNav from './discussNav.js';


const DiscussionHome = () => {
    const [discussions, setDiscussions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [selectorChoice, setSelectorChoice] = useState("");
    const [dropdownSelection, setDropdownSelection] = useState("");
    const [cities, setCities] = useState([]); 
    const [selectedCity, setSelectedCity] = useState(''); 

    
    const handleCancel = () => {
        setShowForm(false);  // Hide the form
        setError('');        // Clear any previous errors
        setTitle('');        // Clear the title
        setContent('');      // Clear the content
        setDropdownSelection('');
        setSelectorChoice('');
    };

    const userPost = {
        title: title,
        content: content,
        selectorChoice: selectorChoice,
        category: dropdownSelection,
        city: selectedCity,
        numFlags: 0,
        date: Date
    };

    const handleSubmit = async () => {
        const encodedCity = encodeURIComponent(selectedCity);
        const discussionSection = await fetch(`http://localhost:5050/city_info/${encodedCity}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }).catch((error) => {
            window.alert(error);
            return;
        });

        const resp = await discussionSection.json();

        var currentDiscussion = resp.discussion || {};
        currentDiscussion.comments = currentDiscussion.comments || [];
        currentDiscussion.comments.push(userPost);

        await fetch(`http://localhost:5050/city_info/${encodedCity}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({discussion: currentDiscussion})
          }).catch((error) => {
            console.log("error")
            return;
          });
        
          const updatedUserPost = {
            ...userPost,
            city: encodedCity
        };

        setDiscussions([updatedUserPost]);
        setShowForm(false);
    }

    useEffect(() => {
        async function fetchCities() {
            try {
                const getCities = await fetch(`http://localhost:5050/city_info`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const citiesArray = await getCities.json();
                if (getCities.status === 200) {
                    // Assuming each city object has a 'name' property
                    const cityNames = citiesArray.map(city => city.name);
                    setCities(cityNames);
                } else {
                    console.error("Failed to fetch cities:", citiesArray.error);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        }
        fetchCities();
    }, []);

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted

        // Change starts here
        const fetchDiscussions = async () => {
            if (selectedCity) {
                try {
                    const response = await fetch(`http://localhost:5050/city_info/${encodeURIComponent(selectedCity)}`);
                    const data = await response.json();
                    if (response.status === 200 && isMounted) {
                        setDiscussions(data.discussion.comments);
                    } else {
                        console.error("Failed to fetch discussions for the selected city:", data.error);
                    }
                } catch (error) {
                    console.error("Error fetching discussions:", error);
                }
            }
        };

        fetchDiscussions();

        return () => {
            isMounted = false; // Cleanup function to set isMounted to false
        };
        // Change ends here
    }, [selectedCity]);
    

    return (
        <div className={styles.DiscussionHome}>
            <h2>Discussions</h2>

            {!showForm && <DiscussNav />}
            
            {error && <div className="error">{error}</div>}

            {!showForm && <button onClick={() => setShowForm(true)} className={styles.createNew}>Create New Discussion</button>}
            
            {!showForm && 
                <select
                    className={styles.filter} 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">Select a City</option>
                    {(cities || []).map((city, index) => (
                         <option key={index} value={city}>{city}</option>
                    ))}
                </select>
            }
    
    <div className={`${styles.threadContainer} ${showForm ? styles.formActive : ''}`}>
        {!showForm && selectedCity && (
            <div className={styles.commentsBox}>
                {(discussions || []).map((discussion, index) => (
                    <div key={index} className={styles.discussionPost}>
                        <div className={styles.authorInfo}>
                            {/* Assuming discussion has authorType, adjust as needed */}
                            <div className={styles.fakeAvatar}></div>
                            <h3>{discussion.authorType === "Your Username" ? "Username" : "Anonymous"}</h3>
                        </div>
                        <div className={styles.postContent}>
                            <h4 className={styles.postTitle}>{discussion.title}</h4>
                            <p>{discussion.content}</p>
                            {/* Assuming discussion has city and category, adjust as needed */}
                            <p className={styles.metadata}>City: {discussion.city} | Category: {discussion.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>



            {showForm && (
                <div className={styles.discussionForm}>
                    <h3>Create New Discussion</h3>
                
                    <label>
                        <span>Title of Post:</span>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Enter the title"
                            className={styles.inputField}
                            required
                        />
                    </label>

                    <label>
                        <span>Post as:</span>
                        <div className={styles.choiceGroup}>
                            <label>
                                <input
                                    type="radio"
                                    value="Anonymous"
                                    required
                                    checked={selectorChoice === "Anonymous"}
                                    onChange={(e) => setSelectorChoice(e.target.value)}
                                />
                                <span>Anonymous</span>
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="Your Username"
                                    required
                                    checked={selectorChoice === "Your Username"}
                                    onChange={(e) => setSelectorChoice(e.target.value)}
                                />
                                <span>Username</span>
                            </label>
                        </div>
                    </label>


                    <label>
                        <span>Select an item:</span>
                        <select
                            value={dropdownSelection}
                            onChange={(e) => setDropdownSelection(e.target.value)} required>
                            <option value="" disabled selected>Select an option</option>
                            <option value="General">General</option>
                            <option value="Crime">Crime</option>
                            <option value="Dining">Dining</option>
                            <option value="Things To Do">Things to Do</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label>
                        <span>Tell us about your Thoughts:</span>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Share your thoughts"
                            className={styles.inputField}
                            required
                        ></textarea>
                    </label>
    
                    <div className={styles.button}>
                        <button onClick={handleSubmit} className={styles.submit}>Submit</button>
                        <button onClick={() => {setShowForm(false); handleCancel();}} className={styles.cancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );        
};

export default DiscussionHome;