import React, { useState, useEffect } from "react";
import "./favDiscs.css"
import { useUser } from '../../contexts/UserContext';

export default function FavDiscs() {
    
    const [favDiscs, setFavDiscs] = useState([]);
    const {user: userProfile } = useUser();

    useEffect(() => {
        // Call the function to get favorite cities when the component mounts
        get_favDiscs();
    }, []); 

    

    async function get_favDiscs() {

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
        setFavDiscs(resp.favorite_discussions);
        console.log(resp.favorite_discussions);
        return resp.favorite_discussions;
    }

    async function removeFavDisc(favDisc) {
      var newFavDiscs = [];
      for (var i = 0; i < favDiscs.length; i++) {
          if (favDiscs[i] != favDisc) {
              newFavDiscs.push(favDiscs[i]);
          }
      }

      await fetch("http://localhost:5050/favorite_discussions/" + userProfile.email, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({favorite_discussions: newFavDiscs})
        }).catch((error) => {
          window.alert(error);
          return;
        });

      setFavDiscs(newFavDiscs);
  }
  
  return (
    <div className="sidebar">
      <h2>Favorited Discussions</h2>
      <ol className="fav-discs-list">
        {favDiscs.length === 0 ? (
          <li>No Favorites</li>
        ) : (
          favDiscs.map((favDisc, index) => (
            <li key={index} className="fav-disc-item">
                <a href={`/discussionHome`}>{favDisc}</a>
                <button onClick={() => removeFavDisc(favDisc)}>Remove Favorite</button>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}    