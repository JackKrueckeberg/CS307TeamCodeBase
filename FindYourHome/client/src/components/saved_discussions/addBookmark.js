import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import { useLocalStorage } from "@uidotdev/usehooks";
import './addBookmark.css'

export default function AddBookmark({_bookmark}) {
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user: userProfile } = useUser();

  useEffect(() => {
    getBookmarks();
  }, [_bookmark]);
  useEffect(() => {
    setIsBookmarked(false); // Reset isBookmarked whenever _bookmark changes
  }, [_bookmark]);

  async function getBookmarks() {
    try {
      const cityInfo = await fetch("http://localhost:5050/users/" + userProfile.email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resp = await cityInfo.json();
      setBookmarks(resp.bookmarked_discussions);
    } catch (error) {
      window.alert(error);
    }
  }

  async function addBookmark(newBookmark) {
    console.log("here")
    console.log(newBookmark)
    try {
      if (bookmarks.includes(newBookmark)) {
        alert("This discussion is already bookmarked.");
        console.log("Already bookmarked");
        return;
      }

      console.log('Adding bookmark');
      console.log(bookmarks);

      const updatedBookmarks = [...bookmarks, newBookmark];
      console.log("updated bookmarks" + updatedBookmarks)
      setBookmarks(updatedBookmarks);

      await fetch("http://localhost:5050/bookmarked_discussions/" + userProfile.email, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookmarked_discussions: updatedBookmarks })
      });
      setIsBookmarked(true); // Update state to hide the button after adding the bookmark
      window.alert("Discussion successfully bookmarked!");
    } catch (error) {
      window.alert(error);
    }
  }

  console.log(bookmarks);

  return (
    <div className="button-container">
      {!isBookmarked && (
        <button className="add-bookmark-button" onClick={() => addBookmark(_bookmark)}>Bookmark this Discussion</button>
      )}
    </div>
  );
}
