import React, { useState } from "react";
import styles from "../Stylings/feedbackStyle.module.css";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import PageAnimation from "../animations/PageAnimation.jsx";
import reportImage from "../Stylings/images/reportAProblem.png";
import reviewImage from "../Stylings/images/review.png";

const Feedback = () => {
  const [showForm, setShowForm] = useState(null);
  const [review, setReview] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [problemError, setProblemError] = useState("");
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();

  const handleShowForm = (formType) => {
    setProblemError("");
    setShowForm(formType);
  };

  const StarRating = ({ onRating }) => {
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={star <= rating ? styles.filledStar : styles.emptyStar}
            onClick={() => onRating(star)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleCancel = () => {
    setProblem("");
    setReview("");
    setReviewTitle("");
    setReviewError("");
    setProblemTitle("");
    setProblemError("");
    setRating(0);
    setShowForm(null);
  };

  const handleSubmitProblem = (e) => {
    e.preventDefault();
    setProblemError("");
    if (!problem.trim() && !problemTitle.trim()) {
      setProblemError("Please provide: your problem summary and description");
      return;
    } else if (!problem.trim()) {
      setProblemError("Please provide: your problem description");
      return;
    } else if (!problemTitle.trim()) {
      setProblemError("Please provide: your problem summary");
      return;
    }
    // Need to Add logic to send problem report to the server
    alert("Problem report submitted!");
    setProblemError("");
    setProblem("");
    setProblemTitle("");
    setShowForm(null);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewError("");
  
    if (rating === 0 && !reviewTitle.trim() && !review.trim()) {
      setReviewError("Please provide: a Star Rating, a Review Title, and your Review Thoughts");
    } else if (rating === 0 && !reviewTitle.trim()) {
      setReviewError("Please provide: a Star Rating and a Review Title");
    } else if (rating === 0 && !review.trim()) {
      setReviewError("Please provide: a Star Rating and your Review Thoughts");
    } else if (!reviewTitle.trim() && !review.trim()) {
      setReviewError("Please provide: a Review Title and your Review Thoughts");
    } else if (rating === 0) {
      setReviewError("Please provide: a Star Rating");
    } else if (!reviewTitle.trim()) {
      setReviewError("Please provide: a Review Title");
    } else if (!review.trim()) {
      setReviewError("Please provide: your Review Thoughts");
    } else {
      // Logic to send review to the server
      alert("Review submitted!");
      setReview("");
      setRating(0);
      setReviewTitle("");
      setShowForm(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");

    navigate("/", { state: { loggedOut: true }, replace: true });
  };

  return (
    <PageAnimation>
      <div className={styles.feedbackContainer}>
        <h2 className={styles.title}>Feedback</h2>
        <div className={styles.navBar}>
          <div class="profiletooltip">
            <button className="profilebtn" onClick={() => navigate("/profile")}>
              Profile
            </button>
          </div>
          <div class="advancedtooltip">
            <button
              className="advancedSearch"
              onClick={() => navigate("/preferences")}
            >
              Advanced Search
            </button>
          </div>
          <div class="discussiontooltip">
            <button
              className="discussionButton"
              onClick={() => navigate("/discussionHome")}
            >
              Discussions
            </button>
          </div>
          <div class="feedbacktooltip">
            <button
              className="profilebtn"
              onClick={() => navigate("/view-city")}
            >
              City Search
            </button>
          </div>
          <button className="logoutbtn" onClick={() => handleLogout()}>
            Logout
          </button>
        </div>
        {showForm === "review" && (
          // Review Form
          <div className={styles.problemForm}>
            <h3 className={styles.title}>Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className={styles.summary}>
                <input
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Review Title"
                />
              </div>
                <StarRating onRating={(rate) => setRating(rate)} />

              <div className={styles.description}>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Your Thoughts"
                />
              </div>
              <span className={styles.formButtons}>
                <button type="submit">Submit Review</button>
                <button onClick={handleCancel}>Cancel</button>
              </span>
            </form>
            {reviewError && (
                <div 
                className={styles.error}
                style={{ visibility: reviewError ? 'visible' : 'hidden' }}
              >
                <p>{reviewError}</p>
              </div>
              
              )}
          </div>
        )}

        {showForm === "problem" && (
          // Problem Report Form
          <div className={styles.problemForm}>
            <h3 className={styles.title}>Report a Problem</h3>
            <form onSubmit={handleSubmitProblem}>
              <div className={styles.summary}>
                <input
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="Summary of Problem"
                />
              </div>
              <div className={styles.description}>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe the problem"
                />
              </div>
              <span className={styles.formButtons}>
                <button type="submit">Submit Problem Report</button>
                <button onClick={handleCancel}>Cancel</button>
              </span>
            </form>
             {problemError && (
                <div 
                className={styles.error}
                style={{ visibility: problemError ? 'visible' : 'hidden' }}
              >
                <p>{problemError}</p>
              </div>
              )}
          </div>
        )}

        {showForm === null && (
          <span className={styles.buttonSpan}>
            <div className={styles.choice}>
              <button
                className={styles.buttons}
                onClick={() => handleShowForm("problem")}
              >
                Report a Problem
              </button>
              <img
                src={reportImage}
                alt="Report a Problem"
                className={styles.image}
              />
            </div>
            <div className={styles.choice}>
              <button
                className={styles.buttons}
                onClick={() => handleShowForm("review")}
              >
                Write a Review
              </button>
              <img
                src={reviewImage}
                alt="Write a Review"
                className={styles.image}
              />
            </div>
          </span>
        )}
      </div>
    </PageAnimation>
  );
};

export default Feedback;
