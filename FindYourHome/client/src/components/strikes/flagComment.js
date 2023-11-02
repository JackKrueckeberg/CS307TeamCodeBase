import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function Flags({ type, commentIndex, replyIndex, _selectedCity }) {
  const [discussion, setDiscussion] = useState({});
  const { user: userProfile } = useUser();
  const [isFlagged, setIsFlagged] = useState(false);

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

  async function removeComment(commentIndex) {
    let curr = { ...discussion };
    if (curr.comments && curr.comments[commentIndex]) {
      curr.comments.splice(commentIndex, 1);
      await updateDiscussion(curr);
      alert("The comment has been removed due to multiple flags.");
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
      curr.comments[commentIndex].replies.splice(replyIndex, 1);
      await updateDiscussion(curr);
      alert("The reply has been removed due to multiple flags.");
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

  // Render the flags or buttons for flagging comments or replies
  return (
    <div>
      {/* Show the flag button only if it hasn't been flagged */}
      {!isFlagged && (
        <button onClick={() => flagItem(type, commentIndex, replyIndex)}>
          {type === "comment" ? "Flag Comment" : "Flag Reply"}
        </button>
      )}
    </div>
  );
}
