import React, { useState, useEffect } from "react";


export default function Bookmarks() {
    
    const [bookmarks, setBookmarks] = useState([]);



    useEffect(() => {
        // Call the function to get favorite cities when the component mounts
        get_bookmarks();
    }, []); 

    

    async function get_bookmarks() {

        const city_info = await fetch("http://localhost:5050/users/user2@example.com", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          window.alert(error);
          return;
        });
    
        const resp = await city_info.json();

        setBookmarks(resp.bookmared_discussions);

        console.log(resp.bookmared_discussions);
    
        return resp.bookmared_discussions;
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
  
      await fetch("http://localhost:5050/bookmarked_discussions/user2@example.com", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({bookmared_discussions: bookmarks})
      }).catch((error) => {
        window.alert(error);
        return;
      });
      
    }
  
  
    








    async function removeBookmark(index) {
        await get_bookmarks()
        bookmarks.splice(index, 1)

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
    
 

return (
  <div>
      <button onClick={() => addBookmark("New York City")}>Add Bookmark</button>
      <button onClick={() => removeBookmark(0)}>Remove Bookmark</button>
    </div>
)
}

