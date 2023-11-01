import React, { useState, useEffect } from "react";
import styles from "../Stylings/discussionStyle.module.css";
import DiscussNav from "./discussNav.js";
import { useUser } from "../contexts/UserContext";import { Queue } from "./recentDiscussionsQueue.js";
import RecentDiscussionsQueue from "./recentDiscussionsQueue.js";
import Autosuggest from 'react-autosuggest';

const DiscussionHome = () => {
  const [discussions, setDiscussions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectorChoice, setSelectorChoice] = useState("");
  const [dropdownSelection, setDropdownSelection] = useState("");
    const [allCities, setAllCities] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [recentDiscussionsQueue, setRecentDiscussionsQueue] = useState(new Queue());  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState("");

  // User Stuff
  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));

  const { user: userProfile } = useUser(); // the id of the current logged in user
  const [user, setInfo] = useState(
    storedSesUser || storedLocUser || userProfile
  );

  // Helper function to fetch cities
  const fetchCities = async () => {
    try {
      const response = await fetch(`http://localhost:5050/city_info`, {
        headers: { "Content-Type": "application/json" },
      });
      const citiesArray = await response.json();
      if (response.ok) {
        const cityNames = citiesArray.map((city) => city.name);
        setCities(cityNames);
      } else {
        console.error("Failed to fetch cities:", citiesArray.error);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setError("");
    setTitle("");
    setContent("");
    setDropdownSelection("");
    setSelectorChoice("");
  };

  // Helper function to fetch discussions
  const fetchDiscussions = async (city) => {
    try {
      const response = await fetch(
        `http://localhost:5050/city_info/${encodeURIComponent(city)}`
      );
      const data = await response.json();
      if (response.ok) {
        const sortedComments = (data.discussion.comments || []).sort(
          (a, b) => b.date - a.date
        );
        setDiscussions(sortedComments);
      } else {
        console.error(
          "Failed to fetch discussions for the selected city:",
          data.error
        );
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  // useEffect for fetching cities
  useEffect(() => {
    fetchCities();
    console.log("first useEffect");
  }, []);

  // useEffect for fetching discussions
  useEffect(() => {
    if (selectedCity) {
      fetchDiscussions(selectedCity);
      console.log("Second useEffect");
    }
  }, [selectedCity]);

  // Handle form submission
  const handleSubmit = async () => {
    let missingFields = [];

    if (!title) missingFields.push("Title of Post");
    if (!selectorChoice) missingFields.push("Post as");
    if (!dropdownSelection) missingFields.push("Discussion Category");
    if (!content) missingFields.push("Thoughts");

    if (missingFields.length) {
      setError(
        `Please fill out the following fields: ${missingFields.join(", ")}`
      );
      return;
    }
    const encodedCity = encodeURIComponent(selectedCity);
    try {
      // Get the current discussions
      const responseGet = await fetch(
        `http://localhost:5050/city_info/${encodedCity}`
      );
      const data = await responseGet.json();
      if (!responseGet.ok) throw new Error("Failed to get discussions");

      let currentDiscussion = data.discussion || {};
      currentDiscussion.comments = currentDiscussion.comments || [];
      currentDiscussion.comments.push({
        title,
        content,
        selectorChoice,
        category: dropdownSelection,
        city: selectedCity,
        numFlags: 0,
        date: Date.now(),
      });

      // Now update the discussions with the new comment
      const responsePatch = await fetch(
        `http://localhost:5050/city_info/${encodedCity}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ discussion: currentDiscussion }),
        }
      );

      if (responsePatch.ok) {
        // Place the new comment at the beginning of the discussions array
        setDiscussions((prev) => [
          currentDiscussion.comments[currentDiscussion.comments.length - 1],
          ...prev,
        ]);
      } else {
        console.error("Failed to update discussion");
      }
    } catch (error) {
      console.error("Error in submitting discussion:", error);
    } finally {
      setShowForm(false);
      setTitle("");
      setContent("");
      setDropdownSelection("");
      setSelectorChoice("");
    }
  };

  return (
    <div className={styles.DiscussionHome}>
      <h2>Discussions</h2>

      {!showForm && <DiscussNav />}

      {!showForm && error && <div className="error">{error}</div>}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={styles.createNew}
          disabled={!selectedCity}
        >
          Create New Discussion
        </button>
      )}

      {!showForm && (
        <select
          className={styles.filter}
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Select a City</option>
          {(cities || []).map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}

      <div
        className={`${styles.threadContainer} ${
          showForm ? styles.formActive : ""
        }`}
      >
        {!showForm && selectedCity && (
          <div className={styles.commentsBox}>
            {(discussions || []).map((discussion, index) => (
              <div key={index} className={styles.discussionPost}>
                <div className={styles.authorInfo}>
                  {/* Assuming discussion has authorType, adjust as needed */}
                  <div className={styles.fakeAvatar}></div>
                  <h3>
                    {discussion.selectorChoice === "Your Username"
                      ? user.username
                      : "Anonymous"}
                  </h3>
                </div>
                <div className={styles.postContent}>
                  <h4 className={styles.postTitle}>{discussion.title}</h4>
                  <p>{discussion.content}</p>
                  {/* Assuming discussion has city and category, adjust as needed */}
                  <p className={styles.metadata}>
                    City: {discussion.city} | Category: {discussion.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.parentErr}>
        {showForm && error && <div className={styles.errorMsg}>{error}</div>}
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
            <span>Please Select a Discussion Category:</span>
            <select
              value={dropdownSelection}
              onChange={(e) => setDropdownSelection(e.target.value)}
              required
            >
              <option value="" disabled selected>
                Select an option
              </option>
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
            <button onClick={handleSubmit} className={styles.submit}>
              Submit
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                handleCancel();
              }}
              className={styles.cancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionHome;
