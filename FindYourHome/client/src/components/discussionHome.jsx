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


 
    const handleCancel = () => {
        setShowForm(false);  // Hide the form
        setError('');        // Clear any previous errors
        setTitle('');        // Clear the title
        setContent('');      // Clear the content
        setCity('');         // Clear the city
        setDropdownSelection('');
        setSelectorChoice('');
    };

    const handleSubmit = async () => {
        try {
            // Send a POST request to the server
            const response = await fetch("http://localhost:5050/discussionRoute/newDiscussion", { 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, city, selectorChoice, dropdownSelection })

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
                const response = await fetch("http://localhost:5050/discussionRoute/getDiscussions");
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

    return (
        <div className={styles.DiscussionHome}>
            <h2>Discussions</h2>
            {!showForm && <DiscussNav />}
            
            {error && <div className="error">{error}</div>}
            
            {!showForm && <button onClick={() => setShowForm(true)}>Create New Discussion</button>}
            
            {!showForm && <div className={styles.commentsBox}>
                {/* TODO: Render comments here */}
                This is where comments will be.
            </div>}


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
                        <span>City Name:</span>
                        <input 
                            type="text" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            placeholder="Which city are you discussing"
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
                            <option value="ToDo">Things to Do</option>
                            <option value="other">Other</option>
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