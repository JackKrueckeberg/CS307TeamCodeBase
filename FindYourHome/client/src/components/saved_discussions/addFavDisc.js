import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import './addFavDisc.css'

export default function AddFavDisc({_favDisc}) {
  const [favDiscs, setFavDiscs] = useState([]);
  const [isFavDisc, setIsFavDisc] = useState(false);
  const { user: userProfile } = useUser();

  useEffect(() => {
    getFavDiscs();
  }, [_favDisc]);
  useEffect(() => {
    setIsFavDisc(false); // Reset favdisc whenever favdisc changes
  }, [_favDisc]);

  async function getFavDiscs() {
    try {
      const cityInfo = await fetch("http://localhost:5050/users/" + userProfile.email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resp = await cityInfo.json();
      setFavDiscs(resp.favorite_discussions);
    } catch (error) {
      window.alert(error);
    }
  }

  async function addFavDisc(newFavDisc) {
    console.log("here")
    console.log(favDiscs)
    try {
      if (favDiscs.includes(newFavDisc)) {
        alert("This discussion is already favorited.");
        console.log("Already favorited");
        return;
      }

      console.log('Adding favorite');
      console.log(favDiscs);

      const updatedFavDiscs = [...favDiscs, newFavDisc];
      console.log("updated favDiscs" + updatedFavDiscs)
      setFavDiscs(updatedFavDiscs);

      await fetch("http://localhost:5050/favorite_discussions/" + userProfile.email, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite_discussions: updatedFavDiscs })
      });
      setIsFavDisc(true); // Update state to hide the button after adding the bookmark
      window.alert("Discussion successfully favorited!");
    } catch (error) {
      window.alert(error);
    }
  }

  console.log(favDiscs);

  return (
    <div>
      {!isFavDisc && (
        <button onClick={() => addFavDisc(_favDisc)}>Favorite this Discussion</button>
      )}
    </div>
  );
}
