import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useLocalStorage } from "@uidotdev/usehooks";
import './Flags.css';

export default function Flags({ type, commentIndex, replyIndex, _selectedCity }) {
  const [discussion, setDiscussion] = useState({});
  const [isFlagged, setIsFlagged] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);


  useEffect(() => {
    getDiscussion();
  }, [_selectedCity]);

  async function getDiscussion() {
    try {
      const cityInfo = await fetch("http://localhost:5050/city_info/" + _selectedCity, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resp = await cityInfo.json();
      setDiscussion(resp.discussion);
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
    }
  }



  async function flagItem(type, commentIndex, replyIndex) {
    let curr = { ...discussion };
    const flagReason = prompt('Please provide a reason for flagging:');
    if (flagReason === null || flagReason === '') {
      alert('Flag reason is required.');
      return;
    }

    if (type === "comment") {
      curr.comments[commentIndex].numFlags++;
      if (curr.comments[commentIndex].numFlags >= 3) {
        removeComment(commentIndex);
      } else {
        await updateDiscussion(curr, flagReason);
      }
    } else if (type === "reply") {
      if (
        curr.comments[commentIndex] &&
        curr.comments[commentIndex].replies &&
        curr.comments[commentIndex].replies[replyIndex]
      ) {
        curr.comments[commentIndex].replies[replyIndex].numFlags++;
        if (curr.comments[commentIndex].replies[replyIndex].numFlags >= 3) {
          removeReply(commentIndex, replyIndex);
        } else {
          await updateDiscussion(curr, flagReason);
        }
      }
    }

    setIsFlagged(true);
  }

  async function likeItem(type, commentIndex, replyIndex) {
    if (type === "comment") {
      if (discussion && 
          discussion.comments && 
          discussion.comments[commentIndex] &&
          discussion.comments[commentIndex].numLikes) {
        discussion.comments[commentIndex].numLikes++;
      } else {
        discussion.comments[commentIndex].numLikes = 1;
      }
    } else if (type === "reply") {
      if (
        discussion.comments[commentIndex] &&
        discussion.comments[commentIndex].replies &&
        discussion.comments[commentIndex].replies[replyIndex]
      ) {
        if (discussion.comments[commentIndex].replies[replyIndex].numLikes) {
          discussion.comments[commentIndex].replies[replyIndex].numLikes++;
        } else {
          discussion.comments[commentIndex].replies[replyIndex].numLikes = 1;
        }
      }
    }
    await updateDiscussionLike(discussion);
    setIsLiked(true);
    // console.log(discussion.comments[commentIndex].numlikes);
  }

  async function dislikeItem(type, commentIndex, replyIndex) {
    if (type === "comment") {
      if (discussion && 
          discussion.comments && 
          discussion.comments[commentIndex] &&
          discussion.comments[commentIndex].numDislikes) {
        discussion.comments[commentIndex].numDislikes++;
      } else {
        discussion.comments[commentIndex].numDislikes = 1;
      }
    } else if (type === "reply") {
      if (
        discussion.comments[commentIndex] &&
        discussion.comments[commentIndex].replies &&
        discussion.comments[commentIndex].replies[replyIndex]
      ) {
        if (discussion.comments[commentIndex].replies[replyIndex].numDislikes) {
          discussion.comments[commentIndex].replies[replyIndex].numDislikes++;
        } else {
          discussion.comments[commentIndex].replies[replyIndex].numDislikes = 1;
        }
      }
    }
    await updateDiscussionLike(discussion);
    setIsDisliked(true);
    // console.log(discussion.comments[commentIndex].numlikes);
  }

  async function removeLikeItem(type, commentIndex, replyIndex) {
    if (type === "comment") {
      if (discussion && 
          discussion.comments && 
          discussion.comments[commentIndex] &&
          discussion.comments[commentIndex].numLikes) {
        discussion.comments[commentIndex].numLikes--;
      } else {
        discussion.comments[commentIndex].numLikes = 0;
      }
    } else if (type === "reply") {
      if (
        discussion.comments[commentIndex] &&
        discussion.comments[commentIndex].replies &&
        discussion.comments[commentIndex].replies[replyIndex]
      ) {
        if (discussion.comments[commentIndex].replies[replyIndex].numLikes) {
          discussion.comments[commentIndex].replies[replyIndex].numLikes--;
        } else {
          discussion.comments[commentIndex].replies[replyIndex].numLikes = 0;
        }
      }
    }
    await updateDiscussionLike(discussion);
    setIsLiked(false);
    // console.log(discussion.comments[commentIndex].numlikes);
  }

  async function removeDislikeItem(type, commentIndex, replyIndex) {
    if (type === "comment") {
      if (discussion && 
          discussion.comments && 
          discussion.comments[commentIndex] &&
          discussion.comments[commentIndex].numDislikes) {
        discussion.comments[commentIndex].numDislikes--;
      } else {
        discussion.comments[commentIndex].numDislikes = 0;
      }
    } else if (type === "reply") {
      if (
        discussion.comments[commentIndex] &&
        discussion.comments[commentIndex].replies &&
        discussion.comments[commentIndex].replies[replyIndex]
      ) {
        if (discussion.comments[commentIndex].replies[replyIndex].numDislikes) {
          discussion.comments[commentIndex].replies[replyIndex].numDislikes--;
        } else {
          discussion.comments[commentIndex].replies[replyIndex].numDislikes = 0;
        }
      }
    }
    await updateDiscussionLike(discussion);
    setIsDisliked(false);
    // console.log(discussion.comments[commentIndex].numlikes);
    console.log(discussion.comments[commentIndex].numlikes);
  }

  async function get_strikes(username) {

    const city_info = await fetch("http://localhost:5050/strikes/" + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      window.alert(error);
      return;
    });

    const resp = await city_info.json();

  
    return resp.strikes;



    return resp.strikes;
}

  async function addStrike(username) {
  
  
    var strikes = await get_strikes(username);
    //console.log(strikes)

    strikes.comments_removed++;
    if (strikes.comments_removed === 2) {
      strikes.is_banned = true;
    }



  

    console.log(strikes);


    await fetch("http://localhost:5050/strikes/" + username, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({strikes: strikes})
    }).catch((error) => {
      window.alert(error);
      return;
    });
    return strikes;
  }

  async function removeComment(commentIndex) {
    let curr = { ...discussion };
    if (curr.comments && curr.comments[commentIndex]) {
      var strikes = addStrike(curr.comments[commentIndex].username)
      curr.comments.splice(commentIndex, 1);
      await updateDiscussion(curr);
      alert("The comment has been removed due to multiple flags.");


  
      strikes.comments_removed++;
      if (strikes.comments_removed === 2) {
        strikes.is_banned = true;
      }

  
  
    }
  }

  async function removeReply(commentIndex, replyIndex) {
    let curr = { ...discussion };
    if (
      curr.comments &&
      curr.comments[commentIndex] &&
      curr.comments[commentIndex].replies &&
      curr.comments[commentIndex].replies[replyIndex]
    ) {
      console.log(curr.comments[commentIndex].replies[replyIndex].username)
      var strikes = addStrike(curr.comments[commentIndex].replies[replyIndex].username)
      curr.comments[commentIndex].replies.splice(replyIndex, 1);
      await updateDiscussion(curr);
      alert("The reply has been removed due to multiple flags.");

      
      if (strikes.comments_removed === 2) {
        strikes.is_banned = true;
      }

  
  
    }
  }

  async function updateDiscussion(data, flagReason) {
    try {
      await fetch("http://localhost:5050/city_info/" + _selectedCity, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discussion: data }),
      });
      alert(`The ${type === "comment" ? "comment" : "reply"} has been successfully flagged! Reason: ${flagReason}`);
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
    }
  }

  async function updateDiscussionLike(data) {
    try {
      await fetch("http://localhost:5050/city_info/" + _selectedCity, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discussion: data }),
      });
      //alert(`The ${type === "comment" ? "comment" : "reply"} has been successfully flagged! Reason: ${flagReason}`);
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
    }
  }

  // Render the flags or buttons for flagging comments or replies
  return (
    <div className="flags-container">
      {!isLiked && (
        <button className="flags-button like-button" onClick={() => likeItem(type, commentIndex, replyIndex)}>
          {type === "comment" ? "👍" : "👍"}
        </button>
      )}
      {isLiked && (
        <button className="flags-button like-button" onClick={() => removeLikeItem(type, commentIndex, replyIndex)}>
          {type === "comment" ? "Unlike Comment" : "Unlike Reply"}
        </button>
      )}
      {!isDisliked && (
        <button className="flags-button dislike-button" onClick={() => dislikeItem(type, commentIndex, replyIndex)}>
          {type === "comment" ? "👎" : "👎"}
        </button>
      )}
      {isDisliked && (
        <button className="flags-button dislike-button" onClick={() => removeDislikeItem(type, commentIndex, replyIndex)}>
          {type === "comment" ? "Remove Dislike from Comment" : "Remove Dislike from Reply"}
        </button>
      )}
      {!isFlagged && (
        <button className="flags-button flag-button" onClick={() => flagItem(type, commentIndex, replyIndex)}>
          {type === "comment" ? "🚩" : "🚩"}
        </button>
      )}
    </div>
  );
}