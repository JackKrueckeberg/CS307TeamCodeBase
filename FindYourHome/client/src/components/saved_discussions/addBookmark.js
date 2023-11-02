import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import { useLocalStorage } from "@uidotdev/usehooks";


export default function AddBookmark() {
    
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







    async function addBookmark(new_bookmarks) {
  
  
      await get_bookmarks();
  
      for (var i = 0; i < bookmarks.length; i++) {

        if (new_bookmarks === bookmarks[i]) {
          
            alert("This discussion is already bookmarked.");
            console.log("already bookmarked")
            return;
          }

        }

  
      console.log('adding bookamrk');
  
      console.log(bookmarks);
  
      bookmarks.push(new_bookmarks);
  
      await fetch("http://localhost:5050/bookmarked_discussions/" + userProfile.email, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({bookmarked_discussions: bookmarks})
      }).catch((error) => {
        window.alert(error);
        return;
      });
      
    }
  
  
    








  

return (
  <div>
      <button onClick={() => addBookmark("example_discussion")}>Add Bookmark</button>
    </div>
)
}

