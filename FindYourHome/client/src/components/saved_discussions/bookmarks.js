import React, { useState, useEffect } from "react";


export default function Bookmarks() {
    
    const [bookmarks, setBookmarks] = useState([]);



    useEffect(() => {
        // Call the function to get favorite cities when the component mounts
        get_bookmarks();
    }, []); 

    

    async function get_bookmarks() {

        const city_info = await fetch("http://localhost:5050/users/user@example.com", {
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
  
      await fetch("http://localhost:5050/bookmarked_discussions/user@example.com", {
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
  
  
    








    async function removeBookmark(bookmark) {
        var newBookmarks = [];
        for (var i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i] != bookmark) {
                newBookmarks.push(bookmarks[i]);
            }
        }

        await fetch("http://localhost:5050/bookmarked_discussions/user@example.com", {
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
      <button onClick={() => addBookmark("example_discussion")}>Add Bookmark</button>
      <button onClick={() => removeBookmark("new_discussion")}>Remove Bookmark</button>
    </div>
)
}

