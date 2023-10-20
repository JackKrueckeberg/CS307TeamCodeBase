import React, { useState, useEffect } from 'react';
import styles from '../Stylings/discussionStyle.module.css';

const DiscussionHome = () => {
    const [discussions, setDiscussions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

 
    const handleCancel = () => {
        setShowForm(false);  // Hide the form
        setError('');        // Clear any previous errors
        setTitle('');        // Clear the title
        setContent('');      // Clear the content
        setCity('');         // Clear the city
    };

    const handleSubmit = async () => {
        try {
            // Send a POST request to the server
            const response = await fetch("http://localhost:5050/discussionRoute/newDiscussion", { 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, city })
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
        <div className="discussionHome">
            <h2>Discussions</h2>
            
            {error && <div className="error">{error}</div>}
            
            {!showForm && <button onClick={() => setShowForm(true)}>Create New Discussion</button>}
            
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
                        />
                    </label>

                    <label>
                        <span>Tell us about your Thoughts:</span>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Share your thoughts"
                            className={styles.inputField}
                        ></textarea>
                    </label>
    
                    <div className={styles.button}>
                        <button onClick={handleSubmit} className={styles.submit}>Submit</button>
                        <button onClick={() => setShowForm(false)} className={styles.cancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );        
};

export default DiscussionHome;