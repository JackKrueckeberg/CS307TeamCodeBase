import React, { useState } from "react";
import '../Stylings/favorites.css';

export default function Favorites() {
    
    const [state, setState] = useState(1);

    const [favorite_searches, setFavoriteSearches] = useState([]);

    const action = (index) => {
        setState(index);
        getUser_favorites();
        console.log(index);
    }

    async function getUser_favorites() {

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

        setFavoriteSearches(resp.favorite_searches);

        console.log(resp.favorite_searches);
    
        return resp.favorite_searches;
    }

    async function removeFavoriteSearch(index) {
        var newFavs = [];
        for (var i = 0; i < favorite_searches.length; i++) {
            if (i != index) {
                newFavs.push(favorite_searches[i]);
            }
        }

        await fetch("http://localhost:5050/favorite_searches/user@example.com", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({favorite_searches: newFavs})
          }).catch((error) => {
            window.alert(error);
            return;
          });

        setFavoriteSearches(newFavs);
    }
    
    console.log(favorite_searches);




    return (
        <div className="container">
            <div className="tabs-block">
                <div onClick={() => action(1)} className={`${state === 1 ? 'tab active-tab' : 'tab'}`}> Favorite Cities </div>
                <div className={`${state === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => action(2)}> Favorite Searches </div>
            </div>

            <div className="contents">
                <div className={`${state === 1 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Cities </h2>
                    <p> Insert city favorites list here</p>
                </div>

                <div className={`${state === 2 ? "content active-content" : "content"}`}>
                    <h2> Here are your Favorite Searches </h2>
                    <p> Insert search favorites list here </p>
                    <ul>
                    {favorite_searches.map((search, index) => (
                        <li key={index}>
                        <button onClick={() => removeFavoriteSearch(index)}>delete</button>
                        {Object.entries(search).map(([key, value]) => {
                            if (value !== null && value !== "" && value !== false) {
                            if (key === 'state' && value === 'default') {
                                return null; // Don't display State: default
                            }
                            return (
                                <span key={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value},{' '}
                                </span>
                            );
                            }
                            return null; // Don't display if the field is not populated
                        })}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}