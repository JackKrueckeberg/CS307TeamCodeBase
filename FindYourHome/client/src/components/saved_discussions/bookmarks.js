import React, { useState, useEffect } from "react";
import "./bookmarks.css"
import { useUser } from '../../contexts/UserContext';
import { useLocalStorage } from "@uidotdev/usehooks";


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



  
    


  

    return (
      
      <div className="sidebar">
          <h2>Bookmarked Discussions</h2>
          <ul>
              {bookmarks.length === 0 ? (
                  <li>No Bookmarks</li>
              ) : (
                  bookmarks.map((bookmark, index) => (
                      <li key={index}>{bookmark}</li>
                  ))
              )}
          </ul>
      </div>
  );
}

