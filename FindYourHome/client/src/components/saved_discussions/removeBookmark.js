import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import { useLocalStorage } from "@uidotdev/usehooks";


export default function RemoveBookmark() {
    
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
    
    console.log(bookmarks);

return (
  <div>
      <button onClick={() => removeBookmark("new_discussion")}>Remove Bookmark</button>
    </div>
)
}

