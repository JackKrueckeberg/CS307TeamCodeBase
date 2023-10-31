import React, { useState, useEffect } from 'react';
import styles from '../Stylings/discussionStyle.module.css';
import DiscussNav from './discussNav.js';
import Autosuggest from 'react-autosuggest';


const DiscussionHome = () => {
    const [discussions, setDiscussions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [selectorChoice, setSelectorChoice] = useState("");
    const [dropdownSelection, setDropdownSelection] = useState("");
    const [allCities, setAllCities] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const getUniqueCitiesWithCasePreserved = (discussions) => {
        const uniqueCitySet = new Set();
        const uniqueCityList = [];
    
        discussions.forEach(discussion => {
            const cityLowerCase = discussion.city.toLowerCase();
            if (!uniqueCitySet.has(cityLowerCase)) {
                uniqueCitySet.add(cityLowerCase);
                uniqueCityList.push(discussion.city);
            }
        });
    
        return uniqueCityList;
    };
    
    const uniqueCities = getUniqueCitiesWithCasePreserved(discussions);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    
    const handleCancel = () => {
        setShowForm(false);  // Hide the form
        setError('');        // Clear any previous errors
        setTitle('');        // Clear the title
        setContent('');      // Clear the content
        setCity('');         // Clear the city
        setDropdownSelection('');
        setSelectorChoice('');
    };

    const userPost = {
        title: title,
        city: city,
        content: content,
        selectorChoice: selectorChoice,
        dropdownSelection: dropdownSelection
    };

    const handleSubmit = async () => {
        try {
            // Send a POST request to the server
            const response = await fetch("http://localhost:5050/discussionPost/newDiscussion", { 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userPost)

            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                console.log(data.message);
                setDiscussions([...discussions, data.discussion]);
                setShowForm(false);
            } else {
                setError("Failed to add discussion. " + data.error);
            }
    
        } catch (error) {
            console.error("There was an error posting the discussion:", error);
        }
    };
    
    useEffect(() => {
        async function fetchDiscussions() {
            try {
                const response = await fetch("http://localhost:5050/discussionPost/getDiscussions");
                const data = await response.json();
    
                if (response.status === 200) {
                    setDiscussions(data);
                } else {
                    console.error("Failed to fetch discussions:", data.error);
                }
    
            } catch (error) {
                console.error("Error fetching discussions:", error);
            }
        }
        fetchDiscussions();
    }, []);

    const handleClear = () => {
        setCity(null);
        setShowResults(false);
        setSearchTerm("");
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        if (value) {
            const inputValue = value.trim().toLowerCase();
            const matchingCities = allCities.filter((city) =>
                city.name.toLowerCase().startsWith(inputValue)
            );

            setSuggestions(matchingCities.map((city) => city.name).slice(0, 10));
        } else {
            setSuggestions([]);
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    return (
        <div className={styles.DiscussionHome}>
            <h2>Discussions</h2>

            {!showForm && <DiscussNav />}
            
            {error && <div className="error">{error}</div>}
            {!showForm &&
            <div className="searchBar">
                <span>Find a City</span>
                {/* <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Enter a city to discuss"
                    className={styles.inputField}
                    required
                /> */}
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={(suggestion) => suggestion}
                    renderSuggestion={(suggestion) => (
                        <div
                            key={suggestion}
                            className="suggestion"
                        >
                            {suggestion}
                        </div>
                    )}
                    inputProps={{
                        type: "text",
                        placeholder: "Enter a city",
                        value: searchTerm,
                        onChange: handleInputChange,
                    }}
                />
            </div>}
            {!showForm && <button onClick={() => setShowForm(true).then(setCity(searchTerm))} className={styles.createNew}>Create New Discussion</button>}
            {!showForm && 
                <select
                    className={styles.filter} 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}>
                    <option value="">All Cities</option>
                    {uniqueCities.map((uniqueCity, index) => (
                         <option key={index} value={uniqueCity}>{capitalizeFirstLetter(uniqueCity)}</option>
                    ))}
                </select>
            }
            <div className={`${styles.threadContainer} ${showForm ? styles.formActive : ''}`}>
            {!showForm && <div className={styles.commentsBox}>
                {discussions.slice().reverse().filter(discussion => !city || discussion.city.toLowerCase() === city.toLowerCase()).map((discussion, index) => (
                    <div key={index} className={styles.discussionPost}>
                        <div className={styles.authorInfo}>
                            <div className={styles.fakeAvatar}></div>
                            <h3>{discussion.authorType === "Your Username" ? "Username" : "Anonymous"}</h3>
                        </div>
                        <div className={styles.postContent}>
                            <h4 className={styles.postTitle}>{discussion.title}</h4>
                            <p>{discussion.content}</p>
                            <p className={styles.metadata}>City: {discussion.city} | Category: {discussion.category}</p>
                        </div>
                    </div>
                ))}
            </div>}
        </div>




            {showForm && (
                <div className={styles.discussionForm}>
                    <h3>Discuss {city}</h3>
                    <label>
                        <span>Title of Discussion</span>
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
                        <span>Select a topic:</span>
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
                        <span>Tell us your thoughts...</span>
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