import React, { useState, useEffect } from "react";
import styles from "../Stylings/discussionStyle.module.css";
import DiscussNav from "./discussNav.js";
import { useUser } from "../contexts/UserContext";
import { Queue } from "./recentDiscussionsQueue.js";
import RecentDiscussionsQueue from "./recentDiscussionsQueue.js";
import Autosuggest from "react-autosuggest";
import { useNavigate } from "react-router";
import Replies from "./replies/replies";
import AddReply from "./replies/addReply";
import Flags from "./strikes/flagComment";
import AddBookmark from "./saved_discussions/addBookmark";
import AddFavDisc from "./saved_discussions/addFavDisc.js";
import PageAnimation from "../animations/PageAnimation";

const DiscussionHome = () => {
  const [discussions, setDiscussions] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectorChoice, setSelectorChoice] = useState("");
  const [dropdownSelection, setDropdownSelection] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentDiscussionsQueue, setRecentDiscussionsQueue] = useState(
    new Queue()
  );
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchBarCity, setSearchBarCity] = useState("");

  const [tagged, setTagged] = useState("");
  const [taggedIn, setTaggedIn] = useState([]);

  // User Stuff
  const storedSesUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const storedLocUser = JSON.parse(localStorage.getItem("currentUser"));

  const { user: userProfile } = useUser(); // the id of the current logged in user
  const [user, setInfo] = useState(
    storedSesUser || storedLocUser || userProfile
  );

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/profileRoute/profile/${user._id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        const userInfo = await response.json();
        // Update the user state with the fetched data
        setInfo({
          ...userInfo,
        });
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
  };

  const navigate = useNavigate();

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

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/record/cities_full_2`
      );
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const cities = await response.json();
      setAllCities(cities);
    } catch (error) {
      console.error("There was an error fetching the cities", error);
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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");

    navigate("/", { state: { loggedOut: true }, replace: true });
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
        const taggedPostsInCity = sortedComments.filter((post) =>
          post.content.includes(`@${user.username}`)
        );

        setTaggedIn(taggedPostsInCity);
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
    fetchData();
  }, []);

  // useEffect for fetching discussions
  useEffect(() => {
    if (selectedCity) {
      fetchDiscussions(selectedCity);
    }
  }, [selectedCity]);

  const handleQueueDiscussion = (discussion) => {
    console.log("discussion queueing");
    setShowHist(true);
    // Check if there's a valid ??? DISCUSSION ??? to enqueue
    if (discussion) {
      // Enqueue the city name to the recent cities queue
      const updatedQueue = recentDiscussionsQueue.enqueue(discussion);
      setRecentDiscussionsQueue(updatedQueue);
    } else {
      console.warn("No valid discussion selected to queue.");
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchBarCity(e.target.value);
    setIsDropdownOpen(true);
  };

  const clearHistory = () => {
    setRecentDiscussionsQueue(new Queue());
    setShowHist(false);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value) {
      const inputValue = value.trim().toLowerCase();
      const matchingCities = allCities.filter((searchBarCity) =>
        searchBarCity.name.toLowerCase().startsWith(inputValue)
      );

      setSuggestions(
        matchingCities.map((searchBarCity) => searchBarCity.name).slice(0, 10)
      );
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

/* User tagging functions */

  // function to check for tagging a user
  const isTagging = async (text) => {
    if (text.includes('@')) {
      const indexOf = text.indexOf('@');
      const spaceIndex = text.indexOf(' ', indexOf);
      const extracted = spaceIndex !== -1 ? text.slice(indexOf + 1, spaceIndex) : text.slice(indexOf + 1);
      console.log(extracted);

      if (extracted !== '') {
        setTagged(extracted);
        return true;
      } 
    } 
    return false;
  }

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
            console.log(!data.isAvailable);
            return !data.isAvailable;
        }
    } catch (error) {
        console.error("Error checking username availability: ", error);
        return false;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    let isTaggingUser = await isTagging(content); // check if the user is tagging another user
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

      if (isTaggingUser) {
        console.log(tagged);
        const existing = await checkExistingUser(tagged);

        if (existing) {
          if (selectorChoice === "Anonymous") {
            const responseNotAnon = await fetch('http://localhost:5050/notification/notify', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                senderUsername: "Anonymous",
                recipientUsername: tagged,
                isMessage: false,
                timeSent: new Date(),
                city: selectedCity,
              }),
            });

            if (responseNotAnon.status === 200) {             
              alert("yay");
            } else {
              alert("something went wrong");
              return;
            }
          } else {
            const responseNotUser = await fetch('http://localhost:5050/notification/notify', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                senderUsername: user.username,
                recipientUsername: tagged,
                isMessage: false,
                timeSent: new Date(),
                city: selectedCity,
              }),
            });

            if (responseNotUser.status === 200) {             
              alert("yay");
            } else {
              alert("something went wrong");
              return;
            }
          }
        } else {
          setError(`${tagged} is not an existing user. Please try again.`);
          return;
        }
      }

    const encodedCity = encodeURIComponent(selectedCity);
    try {
      // Get the current discussions
      if (!user.strikes.is_banned) {
        const responseGet = await fetch(
          `http://localhost:5050/city_info/${encodedCity}`
        );
        const data = await responseGet.json();
        if (!responseGet.ok) throw new Error("Failed to get discussions");

        let currentDiscussion = data.discussion || {};
        handleQueueDiscussion(selectedCity);
        currentDiscussion.comments = currentDiscussion.comments || [];
        currentDiscussion.comments.push({
          title,
          content,
          selectorChoice,
          category: dropdownSelection,
          city: selectedCity,
          numLikes: 0,
          numDislikes: 0,
          numFlags: 0,
          date: Date.now(),
          replies: [],
          postedBy: {
            username: user.username,
          },
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
          if (selectorChoice == "Anonymous") {
            alert("Successfully Posted Anonymously");
          } else {
            alert(`Successfully Posted as ${user.username}`);
          }
        } else {
          console.error("Failed to update discussion");
        }
      } else {
        window.alert("you can not comment. You are banned!");
      }
    } catch (error) {
      console.error("Error in submitting discussion:", error);
    } finally {
      setShowForm(false);
      setTitle("");
      setContent("");
      setDropdownSelection("");
      setSelectorChoice("");
      setTagged("");
      setError("");
    }
  };



  return (
    <PageAnimation>
      <div className={styles.DiscussionHome}>
        <h2 className={styles.headertext}>Discussions</h2>

        {!showForm && (
          <div className="navBar">
            <div className="profiletooltip">
              <button
                className="profilebtn"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <span className="profiletooltiptext">
                View your profile page and make edits
              </span>
            </div>
            <div className="discussiontooltip">
              <button
                className="discussionButton"
                onClick={() => navigate("/view-city")}
              >
                City Search
              </button>
              <span className="discussiontooltiptext">
                Search for cities by name
              </span>
            </div>
            <div className="advancedtooltip">
              <button
                className="advancedSearch"
                onClick={() => navigate("/preferences")}
              >
                Advanced Search
              </button>
              <span className="advancedtooltiptext">
                Search based on attributes of cities
              </span>
            </div>
            <div class="feedbacktooltip">
                    <button className="feedbackButton" onClick={() => navigate("/Feedback")}>Feedback</button>
            </div>
            <button className="logoutbtn" onClick={() => handleLogout()}>
              Logout
            </button>
          </div>
        )}

        {!showForm && (
          <select
            className={styles.filter}
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              handleQueueDiscussion(e.target.value);
            }}
          >
            <option value="">Select a City to View or Post Discussions</option>
            {(cities || []).map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        )}

        {!showForm && (
          <div className={styles.createNewBar}>
            <button
              onClick={() => setShowForm(true)}
              className={styles.createNew}
              disabled={!selectedCity}
            >
              Create New Discussion
            </button>
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className={styles.createNew}
            >
              Toggle Search Bar
            </button>
            {selectedCity && (
              <>
                <AddBookmark _bookmark={selectedCity} />
                <AddFavDisc _favDisc={selectedCity} />
              </>
            )}
          </div>
        )}

        {!showForm && showSearchBar && (
          <div>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={(suggestion) => suggestion}
              renderSuggestion={(suggestion) => (
                <div key={suggestion} className="suggestion">
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
          </div>
        )}

        {!showForm && showHist && (
          <div className={styles.text}>
            <RecentDiscussionsQueue queue={recentDiscussionsQueue} />
            <button className={styles.createNew} onClick={() => clearHistory()}>
              Clear History
            </button>
          </div>
        )}

        {!showForm && selectedCity && (
          <div className={styles.categoryFilterButtons}>
            <button
              className={
                selectedCategory === "All" ? styles.selectedButton : ""
              }
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            <button
              className={
                selectedCategory === "General" ? styles.selectedButton : ""
              }
              onClick={() => setSelectedCategory("General")}
            >
              General
            </button>
            <button
              className={
                selectedCategory === "Crime" ? styles.selectedButton : ""
              }
              onClick={() => setSelectedCategory("Crime")}
            >
              Crime
            </button>
            <button
              className={
                selectedCategory === "Dining" ? styles.selectedButton : ""
              }
              onClick={() => setSelectedCategory("Dining")}
            >
              Dining
            </button>
            <button
              className={
                selectedCategory === "Things To Do" ? styles.selectedButton : ""
              }
              onClick={() => setSelectedCategory("Things To Do")}
            >
              Things to Do
            </button>
            <button
              className={
                selectedCategory === "Other" ? styles.selectedButton : ""
              }
              onClick={() => setSelectedCategory("Other")}
            >
              Other
            </button>
          </div>
        )}

        <div
          className={`${styles.threadContainer} ${
            showForm ? styles.formActive : ""
          }`}
        >
          {!showForm && selectedCity && (
            <div className={styles.commentsBox}>
              {discussions.length === 0 ? (
                <div className={styles.noDiscussionsMessage}>
                  Start a Discussion for this City above!
                </div>
              ) : (
                (() => {
                  const filteredDiscussions = discussions.filter(
                    (discussion) =>
                      selectedCategory === "All" ||
                      discussion.category === selectedCategory
                  );

                  return filteredDiscussions.length === 0 ? (
                    <div className={styles.noDiscussionsMessage}>
                      No discussions found in this category. Start a Discussion
                      for this Category above!
                    </div>
                  ) : (
                    filteredDiscussions.map((discussion) => (
                      <div
                        key={discussion.id || discussion.title}
                        className={styles.discussionPost}
                      >
                        <div className={styles.authorInfo}>
                          <h3>
                            {discussion.selectorChoice === "Your Username"
                              ? "Posted by " + discussion.postedBy.username
                              : "Posted Anonymously"}
                          </h3>
                        </div>
                        <div className={styles.postContent}>
                          <h4 className={styles.postTitle}>
                          {taggedIn.includes(discussion) && (
                            <span className={styles.tagIndicator}>⭐</span>
                          )} 
                            {discussion.title}
                          </h4>
                          <p>"{discussion.content}"</p>
                          <Flags
                            type="comment"
                            commentIndex={filteredDiscussions.indexOf(
                              discussion
                            )}
                            _selectedCity={selectedCity}
                          />
                          <p className={styles.metadata}>
                            City: {discussion.city} | Category:{" "}
                            {discussion.category}
                          </p>
                          <Replies
                            commentIndex={filteredDiscussions.indexOf(
                              discussion
                            )}
                            _selectedCity={selectedCity}
                          />
                        </div>
                      </div>
                    ))
                  );
                })()
              )}
            </div>
          )}
        </div>

        <div className={styles.parentErr}>
          {showForm && error && <div className={styles.errorMsg}>{error}</div>}
        </div>

        {showForm && (
          <div className={styles.discussionForm}>
            <h3>New Discussion about {selectedCity}</h3>

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
                onChange={(e) => {setContent(e.target.value); isTagging(e.target.value);} }
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
    </PageAnimation>
  );
};

export default DiscussionHome;
