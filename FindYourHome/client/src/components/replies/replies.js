import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import { useCity } from "../../contexts/CityContext";
import { useLocalStorage } from "@uidotdev/usehooks";

import styles from './replies.module.css';
import Flags from '../strikes/flagComment'

export default function Replies({ commentIndex, _selectedCity }) {
  const { user: userProfile } = useUser();
  const [replies, setReplies] = useState([]);
  const [discussion, setDiscussion] = useState({});
  const [banned, setBanned] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    getReplies();
    loadUserData();
  }, []); 

  async function getReplies() {
    try {
      const city_info = await fetch("http://localhost:5050/city_info/" + _selectedCity, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resp = await city_info.json();
      const comments = resp.discussion.comments;

      if (comments && comments[commentIndex] && comments[commentIndex].replies) {
        setReplies(comments[commentIndex].replies);
      }
      
      setDiscussion(resp.discussion);
    } catch (error) {
      window.alert(error);
    }
  }

  async function loadUserData() {
    try {
      const user_info = await fetch("http://localhost:5050/users/" + userProfile.email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resp = await user_info.json();
      setBanned(resp.strikes.is_banned);
      setCurrentUsername(resp.username);
    } catch (error) {
      window.alert(error);
    }
  }

  async function reply(content) {
    try {
      if (!banned) {
        const updatedReplies = [...replies, { username: currentUsername, content }];
        setReplies(updatedReplies);

        discussion.comments[commentIndex].replies.push({ username: currentUsername, content, numLikes: 0, numFlags: 0, time: Date.now()});

        await fetch("http://localhost:5050/city_info/" + _selectedCity, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discussion }),
        });
      } else {
        window.alert("You are banned from commenting!");
      }
    } catch (error) {
      console.error("Error replying:", error);
    }
  }

  async function removeReply(index) {
    try {
      const updatedReplies = [...replies];
      updatedReplies.splice(index, 1);
      setReplies(updatedReplies);

      const curr = { ...discussion };
      curr.comments[commentIndex].replies.splice(index, 1);

      await fetch("http://localhost:5050/city_info/" + _selectedCity, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discussion: curr }),
      });
    } catch (error) {
      console.error("Error removing reply:", error);
    }
  }

  

  return (
    <div className={styles.replyContainer}>
      <h2>Replies:</h2>
      {replies.map((reply, index) => (
        <div key={index} className={styles.replyItem}>
          <div className={styles.replyDetails}>
            <span className={styles.replyUsername}>{reply.username}</span>
            <Flags type="reply" commentIndex={commentIndex} replyIndex={index} _selectedCity={_selectedCity} /> {/* Insert Flags component for replies */}
          </div>
          <p className={styles.replyContent}>{reply.content}</p>
          {reply.username === currentUsername && (
            <button onClick={() => removeReply(index)} className={styles.replyButton}>
              Remove Reply
            </button>
          )}
        </div>
      ))}
      <div>
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Type your reply"
          className={styles.replyInput}
        />
        <button onClick={() => reply(replyContent)} className={styles.replyButton}>
          Reply
        </button>
      </div>
    </div>
  );
}