import React, { useState, useEffect } from "react";
import "./bookmarks.css"
import { useUser } from '../../contexts/UserContext';
import { useLocalStorage } from "@uidotdev/usehooks";
import RemoveBookmark from "./removeBookmark";


export default function Bookmarks() {
    
    const [bookmarks, setBookmarks] = useState([]);
    const {user: userProfile } = useUser();



    useEffect(() => {
        // Call the function to get favorite cities when the component mounts
        get_bookmarks();
    }, []); 

    

    async function get_bookmarks() {

        const city_info = await fetch("http://localhost:5050/users/" + userProfile.email, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          window.alert(error);
          return;
        });
    
        const resp = await city_info.json();

        setBookmarks(resp.bookmarked_discussions);

        console.log(resp.bookmarked_discussions);
    
        return resp.bookmarked_discussions;
    }


    async function removeBookmark(bookmark) {
      var newBookmarks = [];
      for (var i = 0; i < bookmarks.length; i++) {
          if (bookmarks[i] != bookmark) {
              newBookmarks.push(bookmarks[i]);
          }
      }

      await fetch("http://localhost:5050/bookmarked_discussions/" + userProfile.email, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({bookmarked_discussions: newBookmarks})
        }).catch((error) => {
          window.alert(error);
          return;
        });

      setBookmarks(newBookmarks);
  }
  
    


  

    return (
      <div className="sidebar">
        <h2>Bookmarked Discussions</h2>
        <ol className="bookmark-list">
          {bookmarks.length === 0 ? (
            <li>No Bookmarks</li>
          ) : (
            bookmarks.map((bookmark, index) => (
              <li key={index} className="bookmark-item">
                  <a href={`/discussionHome`}>{bookmark}</a>
                  <button onClick={() => removeBookmark(bookmark)}>Remove Bookmark</button>
              </li>
            ))
          )}
        </ol>
      </div>
    );
}    