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
  const [expanded, setExpanded] = useState(false);

  const [taggedIn, setTaggedIn] = useState(false);
  const [tagged, setTagged] = useState("");
  const [taggedPost, setTaggedPost] = useState([]);

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

        const taggedComments = comments[commentIndex].replies.filter((post) => 
          post.content.includes(`@${currentUsername}`)
        );

        setTaggedPost(taggedComments);

        if (taggedComments.length) {
          setTaggedIn(true);
        } else {
          setTaggedIn(false);
        }
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

  async function reply(content) {
    try {
      if (!banned) {
        let isTaggingUser = await isTagging(content); // check if the user is tagging another user

        if (isTaggingUser) {
          console.log(tagged);
          const existing = await checkExistingUser(tagged);
  
          if (existing) {
            const notifyResp = await fetch('http://localhost:5050/notification/notify', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                senderUsername: currentUsername,
                recipientUsername: tagged,
                isMessage: false,
                timeSent: new Date(),
                city: _selectedCity,
              }),
            });
  
            if (notifyResp.status === 200) {             
              alert("yay");
            } else {
              alert("something went wrong");
              return;
            }
          } else {
            alert(`${tagged} is not an existing user. Please try again.`);
            setReplyContent('');
            return;
          }
        } 

        const updatedReplies = [...replies, { username: currentUsername, content }];
        setReplies(updatedReplies);

        discussion.comments[commentIndex].replies.push({ username: currentUsername, content, numLikes: 0, numDislikes: 0, numFlags: 0, time: Date.now()});

        await fetch("http://localhost:5050/city_info/" + _selectedCity, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discussion }),
        });
        setReplyContent('');
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
      <button className={styles.button} onClick={() => setExpanded(!expanded)}>{expanded ? "collapse replies" : `expand ${replies.length} replies`}
      {taggedIn === true && (
        <span className={styles.taggedIndicator}>⭐</span>
      )}
      </button>
      {expanded &&
        <div>
          <h2>Replies:</h2>
          {replies.map((reply, index) => (
            <div key={index} className={styles.replyItem}>
              <div className={styles.replyDetails}>
                {taggedPost.includes(reply) && (
                  <span className={styles.taggedIndicator}>⭐</span>
                )}
                <span className={styles.replyUsername}>Reply from {reply.username}</span>
              </div>
              <p className={styles.replyContent}>{reply.content}</p>
              {reply.username === currentUsername && (
                <button onClick={() => removeReply(index)} className={styles.replyButton}>
                  Remove Reply
                </button>
              )}
              <Flags type="reply" commentIndex={commentIndex} replyIndex={index} _selectedCity={_selectedCity} /> {/* Insert Flags component for replies */}
            </div>
          ))}
          <div>
            <input
              type="text"
              value={replyContent}
              onChange={(e) => { setReplyContent(e.target.value); isTagging((e.target.value)); }}
              placeholder="Type your reply"
              className={styles.replyInput}
            />
            <button onClick={() => reply(replyContent)} className={styles.replyButton}>
              Reply
            </button>
          </div>
        </div>
      }
    </div>
  );
}