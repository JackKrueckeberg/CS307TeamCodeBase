import React, { useState, useEffect } from "react";


export default function Bookmarks() {
    
    const [bookmarks, setBookmarks] = useState([]);



  

    

    async function get_bookmarks() {

        const bookmarks = await fetch("http://localhost:5050/bookmarked_discussions/user2@example.com", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          window.alert(error);
          return;
        });
    
        const resp = await bookmarks.json();

        setBookmarks(resp.bookmarked_discussions);

        //console.log(resp.bookmarked_discussions);
        console.log(bookmarks)
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
  
      await fetch("http://localhost:5050/bookmarked_discussions/user2@example.com", {
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
  
  
    








    async function removeBookmark(index) {
        await get_bookmarks()
        console.log(bookmarks)
        bookmarks.splice(index, 1)

        await fetch("http://localhost:5050/bookmarked_discussions/user2@example.com", {
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

