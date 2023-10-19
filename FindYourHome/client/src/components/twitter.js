import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Stylings/advancedPrefs.css";

export default function Twitter() {
    const [response, setResponse] = useState("");

    async function getTweets() {
        const tweets = await fetch("http://localhost:5050/get_tweet", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            }).catch((error) => {
            window.alert(error);
            return;
        });

        console.log(await tweets.json());
        setResponse(tweets);
    }

    function createMarkup(html) {
        console.log("markup");
        return {__html: html};
    }
  
  return (
    <div>
        <label>Tweets in this area</label>
        <button onClick={() => getTweets()}>Click me</button>
        <div dangerouslySetInnerHTML={createMarkup(response.html)} />;
    </div>
  );
}
